import React from "react";
import type { RoomState } from "../types";
import type { ClientToServer, ServerToClient } from "./protocol";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8787";

export function useRoom() {
  const [ws, setWs] = React.useState<WebSocket | null>(null);
  const [selfId, setSelfId] = React.useState<string | null>(null);
  const [state, setState] = React.useState<RoomState | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const connect = React.useCallback(() => {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
    const socket = new WebSocket(WS_URL);
    socket.onmessage = (ev) => {
      try {
        const msg: ServerToClient = JSON.parse(ev.data);
        if (msg.type === "joined") {
          setSelfId(msg.selfId);
          setState(msg.state);
          setError(null);
        } else if (msg.type === "state") {
          setState(msg.state);
        } else if (msg.type === "error") {
          setError(msg.message);
        }
      } catch {
        // ignore
      }
    };
    socket.onclose = () => {
      // keep UI usable; user can reconnect via button
      setWs(null);
    };
    socket.onerror = () => setError("WebSocket-Fehler. Prüfe die Server-URL.");
    setWs(socket);
  }, [ws]);

  const send = React.useCallback((msg: ClientToServer) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError("Nicht verbunden. Tippe auf „Verbinden“.");
      return;
    }
    ws.send(JSON.stringify(msg));
  }, [ws]);

  return { ws, connect, send, selfId, state, error };
}
