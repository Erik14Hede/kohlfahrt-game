// src/app/wsClient.ts
export type WsStatus = "idle" | "connecting" | "open" | "closed" | "error";

type Handlers = {
  onState?: (state: any) => void;
  onJoined?: (payload: any) => void;
  onAction?: (payload: any) => void;
  onError?: (e: Event) => void;
  onClose?: (e: CloseEvent) => void;
};

export function createWsClient(baseUrl: string, handlers: Handlers = {}) {
  let ws: WebSocket | null = null;
  let status: WsStatus = "idle";
  let joinPayload: any = null;
  let reconnectTimer: any = null;

  const notifyStatus = (s: WsStatus) => { status = s; };

  const connect = () => {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;

    notifyStatus("connecting");
    ws = new WebSocket(baseUrl.endsWith("/") ? baseUrl : baseUrl + "/");

    ws.onopen = () => {
      notifyStatus("open");
      // ALWAYS join on open (reliable)
      if (joinPayload) ws?.send(JSON.stringify(joinPayload));
    };

    ws.onmessage = (ev) => {
      let msg: any;
      try { msg = JSON.parse(ev.data); } catch { return; }

      if (msg.type === "joined") handlers.onJoined?.(msg);
      else if (msg.type === "state") handlers.onState?.(msg.state);
      else if (msg.type === "action") handlers.onAction?.(msg.action);
    };

    ws.onerror = (e) => {
      notifyStatus("error");
      handlers.onError?.(e);
    };

    ws.onclose = (e) => {
      notifyStatus("closed");
      handlers.onClose?.(e);
      // simple reconnect (optional but nice on Render sleep)
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => connect(), 1000);
    };
  };

  const setJoin = (payload: any) => {
    joinPayload = payload;
    // if already open, send immediately too
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(joinPayload));
    }
  };

  const send = (payload: any) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    ws.send(JSON.stringify(payload));
    return true;
  };

  const getStatus = () => status;

  const close = () => {
    clearTimeout(reconnectTimer);
    ws?.close();
    ws = null;
    notifyStatus("closed");
  };

  return { connect, close, send, setJoin, getStatus };
}
