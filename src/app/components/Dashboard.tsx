import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Plus, Trophy, Gift, Home } from 'lucide-react';
import { Player, Team, GameMode, Screen } from '../App';

interface DashboardProps {
  tourName: string;
  gameMode: GameMode;
  players: Player[];
  teams: Team[];
  onNavigate: (screen: Screen) => void;
}

export function Dashboard({ tourName, gameMode, players, teams, onNavigate }: DashboardProps) {
  const games = [
    { id: 'quiz', name: 'Kohlfahrt Quiz', icon: '🧠', screen: 'quiz' as Screen },
    { id: 'drawing', name: 'Mal-Spiel', icon: '🎨', screen: 'drawing' as Screen },
    { id: 'timeline', name: 'Zeitstrahl', icon: '📅', screen: 'timeline' as Screen },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl mb-2">🥬</h1>
          <h1 className="text-4xl text-green-900 mb-2">{tourName}</h1>
          <p className="text-green-700">
            {gameMode === 'individual' 
              ? `${players.length} Spieler` 
              : `${teams.length} Teams`}
          </p>
        </motion.div>

        {/* Main Menu Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Mini Games */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600"
          >
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl text-green-900">Mini-Spiele</h2>
            </div>
            <div className="space-y-3">
              {games.map((game, index) => (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  onClick={() => onNavigate(game.screen)}
                  className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-200 hover:border-green-400 transition-all text-left flex items-center gap-3"
                >
                  <span className="text-3xl">{game.icon}</span>
                  <span className="text-lg text-green-900">{game.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Other Options */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Manual Score */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-amber-500">
              <button
                onClick={() => onNavigate('manualScore')}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Plus className="w-7 h-7 text-amber-600" />
                  <h2 className="text-xl text-amber-900">Punkte hinzufügen</h2>
                </div>
                <p className="text-sm text-amber-700">
                  Für externe Spiele
                </p>
              </button>
            </div>

            {/* Bonus Points */}
            {gameMode === 'individual' && (
              <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-purple-500">
                <button
                  onClick={() => onNavigate('bonusPoints')}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Gift className="w-7 h-7 text-purple-600" />
                    <h2 className="text-xl text-purple-900">Bonuspunkte</h2>
                  </div>
                  <p className="text-sm text-purple-700">
                    Vergib Bonuspunkte an andere
                  </p>
                </button>
              </div>
            )}

            {/* Scoreboard */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-blue-500">
              <button
                onClick={() => onNavigate('scoreboard')}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-7 h-7 text-blue-600" />
                  <h2 className="text-xl text-blue-900">Punktestand</h2>
                </div>
                <p className="text-sm text-blue-700">
                  Aktuelle Rangliste anzeigen
                </p>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Background Decoration */}
        <div className="text-center text-6xl opacity-20 mt-8">
          🌭🥬🌭🥬🌭
        </div>
      </div>
    </div>
  );
}
