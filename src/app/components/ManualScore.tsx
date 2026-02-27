import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, ArrowLeft } from 'lucide-react';
import { Player, Team, GameMode } from '../App';

interface ManualScoreProps {
  players: Player[];
  teams: Team[];
  gameMode: GameMode;
  onAddPoints: (id: string, points: number) => void;
  onBack: () => void;
}

export function ManualScore({ players, teams, gameMode, onAddPoints, onBack }: ManualScoreProps) {
  const [selectedId, setSelectedId] = useState('');
  const [points, setPoints] = useState(10);
  const [gameName, setGameName] = useState('');

  const handleSubmit = () => {
    if (selectedId && points > 0) {
      onAddPoints(selectedId, points);
      
      const name = gameMode === 'individual'
        ? players.find(p => p.id === selectedId)?.name
        : teams.find(t => t.id === selectedId)?.name;
      
      alert(`${points} Punkte für ${name} hinzugefügt!`);
      setSelectedId('');
      setPoints(10);
      setGameName('');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl mb-4">➕</h1>
            <h1 className="text-4xl text-green-900 mb-2">Punkte hinzufügen</h1>
            <p className="text-green-700">Für externe Spiele</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-amber-500 mb-6">
            {/* Game Name (optional) */}
            <div className="mb-6">
              <label className="block mb-2 text-green-900">Spielname (optional)</label>
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="z.B. Boßeln"
                className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
              />
            </div>

            {/* Select Player/Team */}
            <div className="mb-6">
              <label className="block mb-2 text-green-900">
                {gameMode === 'individual' ? 'Spieler auswählen' : 'Team auswählen'}
              </label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none bg-white"
              >
                <option value="">Auswählen...</option>
                {gameMode === 'individual'
                  ? players.map(player => (
                      <option key={player.id} value={player.id}>{player.name}</option>
                    ))
                  : teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))
                }
              </select>
            </div>

            {/* Points */}
            <div className="mb-6">
              <label className="block mb-2 text-green-900">Punkte</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setPoints(Math.max(1, points - 5))}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg text-xl"
                >
                  −
                </button>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="flex-1 px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none text-center text-2xl"
                  min="1"
                />
                <button
                  onClick={() => setPoints(points + 5)}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg text-xl"
                >
                  +
                </button>
              </div>

              {/* Quick Buttons */}
              <div className="flex gap-2 mt-3">
                {[10, 25, 50, 100].map(val => (
                  <button
                    key={val}
                    onClick={() => setPoints(val)}
                    className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                      points === val
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-green-900 border-green-300 hover:border-green-500'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!selectedId}
              className={`w-full py-4 rounded-lg text-white font-semibold text-lg flex items-center justify-center gap-2 ${
                selectedId
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-6 h-6" />
              Punkte hinzufügen
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Zurück zum Menü
          </button>
        </motion.div>
      </div>
    </div>
  );
}
