import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Crown, ArrowLeft } from 'lucide-react';
import { Player, Team, GameMode } from '../App';

interface ScoreboardProps {
  players: Player[];
  teams: Team[];
  gameMode: GameMode;
  onBack: () => void;
  onAnnounceWinner: () => void;
}

export function Scoreboard({ players, teams, gameMode, onBack, onAnnounceWinner }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl mb-4">🏆</h1>
            <h1 className="text-4xl text-green-900 mb-2">Punktestand</h1>
            <p className="text-green-700">Aktuelle Rangliste</p>
          </div>

          {/* Scoreboard */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600 mb-6">
            {gameMode === 'individual' ? (
              <div className="space-y-3">
                {sortedPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                      index === 0
                        ? 'bg-yellow-50 border-yellow-400'
                        : index === 1
                        ? 'bg-gray-50 border-gray-400'
                        : index === 2
                        ? 'bg-orange-50 border-orange-400'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold w-8 ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {index + 1}
                      </div>
                      {index === 0 && <Crown className="w-6 h-6 text-yellow-600" />}
                      <span className="text-xl text-green-900">{player.name}</span>
                    </div>
                    <div className="text-2xl text-green-900">{player.score}</div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border-2 ${
                      index === 0
                        ? 'bg-yellow-50 border-yellow-400'
                        : index === 1
                        ? 'bg-gray-50 border-gray-400'
                        : index === 2
                        ? 'bg-orange-50 border-orange-400'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className={`text-2xl font-bold w-8 ${
                          index === 0 ? 'text-yellow-600' :
                          index === 1 ? 'text-gray-600' :
                          index === 2 ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {index + 1}
                        </div>
                        {index === 0 && <Crown className="w-6 h-6 text-yellow-600" />}
                        <span className="text-xl text-green-900">{team.name}</span>
                      </div>
                      <div className="text-2xl text-green-900">{team.score}</div>
                    </div>
                    <div className="text-sm text-green-700 ml-12">
                      {team.playerIds.map(id => players.find(p => p.id === id)?.name).join(', ')}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück
            </button>
            <button
              onClick={onAnnounceWinner}
              className="flex-1 py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Gewinner verkünden
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
