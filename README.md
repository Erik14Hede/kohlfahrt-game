
  # Kohlfahrt Game App

  This is a code bundle for Kohlfahrt Game App. The original project is available at https://www.figma.com/design/EyX8YfZ87sMCw0FmKV7zX6/Kohlfahrt-Game-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  

## Multiplayer (Host + Player)

This project is split into:
- **Frontend (Vite + React)** → deployable on GitHub Pages
- **WebSocket server** in `/server` → lightweight Node server for real-time sync

### 1) Start locally

Terminal 1 (frontend):
```bash
npm i
npm run dev
```

Terminal 2 (server):
```bash
cd server
npm i
npm run dev
```

Frontend expects a WebSocket URL in `VITE_WS_URL`.
Create `.env` in the project root:

```bash
VITE_WS_URL=ws://localhost:8787
```

Open:
- Host: `http://localhost:5173/#/host`
- Player: `http://localhost:5173/#/play/XXXXX` (room code shown in Host)

### 2) Deploy

- **Frontend**: GitHub Pages (build with `npm run build`)
- **Server**: Render / Railway / Fly.io etc. Start command: `node index.js` inside `/server`.
  - Set `PORT` env var (Render does this automatically)
  - Use `wss://...` and set `VITE_WS_URL` in GitHub Pages build environment.
