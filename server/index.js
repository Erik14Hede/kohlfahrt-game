import http from "http";
import { WebSocketServer } from "ws";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;

const rooms = new Map(); // roomCode -> { state, clients: Set<{ws, id, roomCode}> }

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function defaultState(roomCode) {
  return {
    roomCode,
    tourName: "Kohl-Tour",
    gameMode: "individual",
    participants: [],
    stage: "lobby",
    winnerId: undefined,
    quiz: undefined,
  };
}

function broadcast(room, msg) {
  const data = JSON.stringify(msg);
  for (const c of room.clients) {
    if (c.ws.readyState === 1) c.ws.send(data);
  }
}

function getRoom(roomCode) {
  const code = String(roomCode || "").toUpperCase();
  let room = rooms.get(code);
  if (!room) {
    room = { state: defaultState(code), clients: new Set() };
    rooms.set(code, room);
  }
  return room;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * IMPORTANT FOR RENDER:
 * Create an HTTP server and attach WebSocket upgrades to it.
 */
const server = http.createServer((req, res) => {
  // Health check endpoints so you can open the Render URL in a browser
  if (req.url === "/" || req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  const client = { ws, id: makeId(), roomCode: null };

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.type === "join") {
      const room = getRoom(msg.roomCode);
      client.roomCode = room.state.roomCode;
      room.clients.add(client);

      const name = String(msg.name || "Spieler").slice(0, 32);
      const role = msg.role === "host" ? "host" : "player";

      let participant = room.state.participants.find((p) => p.id === client.id);
      if (!participant) {
        participant = { id: client.id, name, pinkel: 0, mettenden: 0, role };
        room.state.participants.push(participant);
      } else {
        participant.name = name;
        participant.role = role;
      }

      ws.send(
        JSON.stringify({
          type: "joined",
          roomCode: room.state.roomCode,
          selfId: client.id,
          state: room.state,
        })
      );
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    // ignore everything else until joined
    if (!client.roomCode) return;
    const room = getRoom(client.roomCode);

    if (msg.type === "host/setMeta") {
      room.state.tourName = String(msg.tourName || room.state.tourName).slice(0, 48);
      room.state.gameMode = msg.gameMode === "teams" ? "teams" : "individual";
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "host/setStage") {
      room.state.stage = msg.stage || "lobby";
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "host/addPinkel") {
      const p = room.state.participants.find((x) => x.id === msg.targetId);
      if (p) p.pinkel += clamp(Number(msg.amount || 0), -1000, 1000);
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "host/addMettenden") {
      const p = room.state.participants.find((x) => x.id === msg.targetId);
      if (p) p.mettenden += clamp(Number(msg.amount || 0), -1000, 1000);
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "player/giveBonus") {
      const from = room.state.participants.find((x) => x.id === msg.fromId);
      const to = room.state.participants.find((x) => x.id === msg.toId);
      const amount = clamp(Number(msg.amount || 0), 0, 10);

      if (from && to && from.id !== to.id && amount > 0) {
        to.mettenden += amount;
      }
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "quiz/start") {
      room.state.quiz = {
        status: "running",
        question: msg.question,
        submissions: {},
        awarded: false,
      };
      room.state.stage = "quiz";
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "quiz/answer") {
      if (!room.state.quiz || room.state.quiz.status !== "running") return;
      room.state.quiz.submissions[msg.fromId] = clamp(Number(msg.answerIndex), 0, 10);
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "quiz/reveal") {
      if (!room.state.quiz) return;
      room.state.quiz.status = "revealed";

      if (!room.state.quiz.awarded) {
        const correct = room.state.quiz.question.correct;
        for (const [pid, ans] of Object.entries(room.state.quiz.submissions)) {
          if (ans === correct) {
            const p = room.state.participants.find((x) => x.id === pid);
            if (p) p.pinkel += 1;
          }
        }
        room.state.quiz.awarded = true;
      }

      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "quiz/next") {
      room.state.quiz = undefined;
      room.state.stage = "lobby";
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "winner/calculate") {
      const ps = room.state.participants;
      if (ps.length) {
        const best = ps.reduce((a, b) => {
          if (b.pinkel > a.pinkel) return b;
          if (b.pinkel === a.pinkel && b.mettenden > a.mettenden) return b;
          return a;
        }, ps[0]);
        room.state.winnerId = best.id;
      } else {
        room.state.winnerId = undefined;
      }
      broadcast(room, { type: "state", state: room.state });
      return;
    }

    if (msg.type === "room/reset") {
      room.state = defaultState(room.state.roomCode);
      broadcast(room, { type: "state", state: room.state });
      return;
    }
  });

  ws.on("close", () => {
    if (!client.roomCode) return;
    const room = rooms.get(client.roomCode);
    if (!room) return;

    room.clients.delete(client);
    room.state.participants = room.state.participants.filter((p) => p.id !== client.id);

    if (room.clients.size === 0) {
      rooms.delete(room.state.roomCode);
    } else {
      broadcast(room, { type: "state", state: room.state });
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Kohlfahrt WS server listening on :${PORT}`);
});
