import React from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import pinkel from "../assets/pinkel.svg";
import mettenden from "../assets/mettenden.svg";

export function RoleSelect() {
  const nav = useNavigate();
  const [roomCode, setRoomCode] = React.useState("");

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      <div className="max-w-md w-full">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600">
          <div className="flex items-center gap-3 mb-2">
            <img src={pinkel} className="w-10 h-10" alt="Pinkel" />
            <h1 className="text-3xl text-green-900">Kohlfahrt-Game</h1>
          </div>
          <p className="text-green-800 mb-6">
            Host startet eine Tour (Raumcode). Alle anderen treten als Spieler*innen bei.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => nav("/host")}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
            >
              Host starten
            </button>

            <div className="border-t pt-4">
              <label className="block text-sm text-green-900 mb-1">Raumcode</label>
              <input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                placeholder="z.B. 7KF2A"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:border-green-500 text-lg"
              />
              <button
                onClick={() => roomCode && nav(`/play/${roomCode}`)}
                disabled={!roomCode}
                className="mt-3 w-full py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg disabled:opacity-50"
              >
                Als Spieler*in beitreten
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-green-700 mt-4">
              <img src={mettenden} className="w-5 h-5" alt="Mettenden" />
              <span>Punkte heißen hier „Pinkel“. Bonus = „Mettenden“.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
