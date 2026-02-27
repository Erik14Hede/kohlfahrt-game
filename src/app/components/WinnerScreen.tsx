import React from 'react';
import { motion } from 'motion/react';
import { Crown, PartyPopper, RotateCcw } from 'lucide-react';
import { Player, Team, GameMode } from '../App';

interface WinnerScreenProps {
  winner: Player | Team;
  gameMode: GameMode;
  onReset: () => void;
}

export function WinnerScreen({ winner, gameMode, onReset }: WinnerScreenProps) {
  const isTeam = gameMode === 'teams';
  const isFemale = !isTeam && (winner as Player).name.toLowerCase().match(/(a|e|ine|in)$/);
  const title = isFemale ? 'Kohlkönigin' : 'Kohlkönig';

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-green-100 to-yellow-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Confetti Animation */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>

        {/* Crown */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Crown className="w-32 h-32 mx-auto text-yellow-500 mb-6" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-12 border-8 border-yellow-400 mb-6"
        >
          <h1 className="text-5xl mb-4 text-green-900">
            {isTeam ? '🏆 Gewinner-Team!' : `👑 ${title}!`}
          </h1>
          <h2 className="text-6xl mb-6 text-yellow-600">
            {winner.name}
          </h2>
          <div className="text-4xl text-green-900 mb-2">
            {winner.score} Punkte
          </div>
          <div className="text-xl text-green-700">
            🥬 Grünkohl-Champion 2026 🌭
          </div>
        </motion.div>

        {/* Celebration Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-green-600 text-white rounded-2xl p-6 mb-6 text-xl"
        >
          <PartyPopper className="w-8 h-8 inline mr-2" />
          Herzlichen Glückwunsch zur erfolgreichen Kohlfahrt!
          <PartyPopper className="w-8 h-8 inline ml-2" />
        </motion.div>

        {/* Decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-6xl mb-8 opacity-50"
        >
          🥬🌭🍺🥬🌭🍺
        </motion.div>

        {/* Reset Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onReset}
          className="py-4 px-8 bg-green-600 text-white rounded-xl text-xl hover:bg-green-700 transition-all hover:scale-105 flex items-center gap-3 mx-auto"
        >
          <RotateCcw className="w-6 h-6" />
          Neue Kohlfahrt starten
        </motion.button>
      </motion.div>
    </div>
  );
}
