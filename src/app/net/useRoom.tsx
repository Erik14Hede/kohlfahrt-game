import React from "react";
import type { RoomState } from "../types";
import type { ClientToServer, ServerToClient } from "./protocol";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8787";

export function useRoom() {
  const [ws, setWs] = React.useState<WebSocket | null>(null);
  const [selfId, setSelfId] = React.useState<string | null>(null);
  const [state, setState] = React.useState<RoomState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [connectionState, setConnectionState] = React.useState<"idle" | "connecting" | "open" | "closed">("idle");

  const connect = React.useCallback(() => {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    setConnectionState("connecting");
    setError(null);

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      setConnectionState("open");
      setError(null);
    };

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
      setConnectionState("closed");
      setWs(null);
      setSelfId(null);
      setState(null);
    };

    socket.onerror = () => setError("WebSocket-Fehler. Pruefe die Server-URL.");
    setWs(socket);
  }, [ws]);

  const send = React.useCallback((msg: ClientToServer) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError("Nicht verbunden. Tippe auf 'Verbinden'.");
      return;
    }
    ws.send(JSON.stringify(msg));
  }, [ws]);

  return {
    ws,
    connect,
    send,
    selfId,
    state,
    error,
    connectionState,
    isOpen: connectionState === "open",
  };
}
