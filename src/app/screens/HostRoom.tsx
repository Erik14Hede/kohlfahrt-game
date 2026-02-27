import React from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useRoom } from "../net/useRoom";
import type { GameMode, Participant } from "../types";
import { QUIZ_QUESTIONS } from "../content/quiz";
import pinkel from "../assets/pinkel.svg";
import mettenden from "../assets/mettenden.svg";

function makeRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function HostRoom() {
  const nav = useNavigate();
  const params = useParams();
  const initialRoom = (params as any).roomCode as string | undefined;

  const { connect, send, selfId, state, error, ws } = useRoom();

  const [roomCode] = React.useState(() => initialRoom || makeRoomCode());
  const [name, setName] = React.useState("Host");
  const [tourName, setTourName] = React.useState("Kohl-Tour");
  const [gameMode, setGameMode] = React.useState<GameMode>("individual");

  React.useEffect(() => {
    connect();
  }, [connect]);

  React.useEffect(() => {
    if (ws?.readyState === WebSocket.OPEN && !selfId) {
      send({ type: "join", roomCode, name, role: "host" });
      nav(`/host/${roomCode}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws, roomCode, selfId]);

  const participants = state?.participants ?? [];
  const connected = !!state;

  const hostMetaSync = () => {
    send({ type: "host/setMeta", roomCode, tourName, gameMode });
  };

  const add = (p: Participant, field: "pinkel" | "mettenden", amount: number) => {
    if (field === "pinkel") send({ type: "host/addPinkel", roomCode, targetId: p.id, amount });
    else send({ type: "host/addMettenden", roomCode, targetId: p.id, amount });
  };

  const startQuiz = () => {
    const q = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
    send({ type: "quiz/start", roomCode, question: q });
    send({ type: "host/setStage", roomCode, stage: "quiz" });
  };

  const revealQuiz = () => send({ type: "quiz/reveal", roomCode });
  const nextQuiz = () => send({ type: "quiz/next", roomCode });

  const showScoreboard = () => send({ type: "host/setStage", roomCode, stage: "scoreboard" });
  const showLobby = () => send({ type: "host/setStage", roomCode, stage: "lobby" });

  const calcWinner = () => {
    send({ type: "winner/calculate", roomCode });
    send({ type: "host/setStage", roomCode, stage: "winner" });
  };

  const reset = () => send({ type: "room/reset", roomCode });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl text-green-900">Host</h1>
              <p className="text-green-800">Raumcode: <span className="font-mono font-bold text-green-900">{roomCode}</span></p>
              <p className="text-sm text-green-700 mt-1">Spieler-Link: <span className="font-mono">/#/play/{roomCode}</span></p>
            </div>
            <button onClick={() => nav("/")} className="px-4 py-2 rounded-lg border-2 border-green-200 hover:bg-green-50">
              Start
            </button>
          </div>

          {!connected && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900">
              Noch nicht verbunden… Stelle sicher, dass der WS-Server läuft. {error ? `(${error})` : ""}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-sm text-green-900 mb-1">Tour-Name</label>
              <input value={tourName} onChange={(e) => setTourName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500"/>
            </div>
            <div>
              <label className="block text-sm text-green-900 mb-1">Modus</label>
              <select value={gameMode} onChange={(e)=>setGameMode(e.target.value as GameMode)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500">
                <option value="individual">Einzel</option>
                <option value="teams" disabled>Teams (kommt als Nächstes)</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={hostMetaSync} className="px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700">
              Einstellungen an alle senden
            </button>
            <button onClick={reset} className="px-4 py-3 rounded-lg border-2 border-red-200 text-red-700 hover:bg-red-50">
              Raum zurücksetzen
            </button>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl text-green-900">Teilnehmende ({participants.length})</h2>
            <div className="text-sm text-green-700">Stage: <span className="font-semibold">{state?.stage ?? "—"}</span></div>
          </div>

          <div className="mt-4 space-y-2">
            {participants.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div>
                  <div className="text-green-900 font-semibold">{p.name}{p.role==="host" ? " (Host)" : ""}</div>
                  <div className="text-sm text-green-700 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1"><img src={pinkel} className="w-4 h-4" alt="" /> {p.pinkel}</span>
                    <span className="inline-flex items-center gap-1"><img src={mettenden} className="w-4 h-4" alt="" /> {p.mettenden}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>add(p,"pinkel",1)} className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">+1 Pinkel</button>
                  <button onClick={()=>add(p,"mettenden",1)} className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">+1 Mettende</button>
                </div>
              </div>
            ))}
            {participants.length === 0 && <div className="text-green-700">Noch keine Spieler*innen beigetreten.</div>}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <button onClick={showLobby} className="py-4 rounded-lg border-2 border-green-200 hover:bg-green-50">Lobby anzeigen</button>
            <button onClick={showScoreboard} className="py-4 rounded-lg border-2 border-green-200 hover:bg-green-50">Scoreboard anzeigen</button>
            <button onClick={startQuiz} className="py-4 rounded-lg bg-green-600 text-white hover:bg-green-700">Quiz starten</button>
            <button onClick={calcWinner} className="py-4 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">Kohlkönig/-königin küren</button>
          </div>

          {state?.stage === "quiz" && state.quiz && (
            <div className="mt-6 p-4 rounded-xl bg-white border-2 border-green-200">
              <div className="text-green-900 font-semibold mb-2">Aktives Quiz</div>
              <div className="text-green-900">{state.quiz.question.question}</div>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {state.quiz.question.answers.map((a, i) => (
                  <div key={i} className={`p-2 rounded-lg border ${state.quiz.status==="revealed" && i===state.quiz.question.correct ? "border-green-600 bg-green-50" : "border-green-200"}`}>
                    {String.fromCharCode(65+i)}. {a}
                  </div>
                ))}
              </div>

              <div className="mt-3 text-sm text-green-700">
                Antworten: {Object.keys(state.quiz.submissions).length}/{participants.filter(p=>p.role==="player").length}
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                <button onClick={revealQuiz} className="px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700">Auflösen & Pinkel vergeben</button>
                <button onClick={nextQuiz} className="px-4 py-3 rounded-lg border-2 border-green-200 hover:bg-green-50">Nächste Frage</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
