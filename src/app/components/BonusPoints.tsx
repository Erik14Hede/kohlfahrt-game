import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gift, ArrowLeft } from 'lucide-react';
import { Player } from '../App';

interface BonusPointsProps {
  players: Player[];
  onAddPoints: (playerId: string, points: number) => void;
  onBack: () => void;
}

export function BonusPoints({ players, onAddPoints, onBack }: BonusPointsProps) {
  const [giverId, setGiverId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [points, setPoints] = useState(5);

  const handleGiveBonus = () => {
    if (giverId && receiverId && giverId !== receiverId && points > 0) {
      onAddPoints(receiverId, points);
      
      const giver = players.find(p => p.id === giverId)?.name;
      const receiver = players.find(p => p.id === receiverId)?.name;
      
      alert(`${giver} hat ${receiver} ${points} Bonuspunkte gegeben! 🎉`);
      setGiverId('');
      setReceiverId('');
      setPoints(5);
    }
  };

  const availableReceivers = players.filter(p => p.id !== giverId);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl mb-4">🎁</h1>
            <h1 className="text-4xl text-green-900 mb-2">Bonuspunkte</h1>
            <p className="text-green-700">Vergib Punkte an andere Spieler</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-purple-500 mb-6">
            {/* Giver */}
            <div className="mb-6">
              <label className="block mb-2 text-green-900">Von wem?</label>
              <select
                value={giverId}
                onChange={(e) => {
                  setGiverId(e.target.value);
                  if (e.target.value === receiverId) {
                    setReceiverId('');
                  }
                }}
                className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none bg-white"
              >
                <option value="">Spieler auswählen...</option>
                {players.map(player => (
                  <option key={player.id} value={player.id}>{player.name}</option>
                ))}
              </select>
            </div>

            {/* Receiver */}
            {giverId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <label className="block mb-2 text-green-900">An wen?</label>
                <select
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                >
                  <option value="">Spieler auswählen...</option>
                  {availableReceivers.map(player => (
                    <option key={player.id} value={player.id}>{player.name}</option>
                  ))}
                </select>
              </motion.div>
            )}

            {/* Points */}
            {giverId && receiverId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <label className="block mb-2 text-green-900">Bonuspunkte</label>
                <div className="flex gap-2">
                  {[1, 3, 5, 10].map(val => (
                    <button
                      key={val}
                      onClick={() => setPoints(val)}
                      className={`flex-1 py-3 rounded-lg border-2 transition-all text-lg ${
                        points === val
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-purple-900 border-purple-300 hover:border-purple-500'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Submit */}
            <button
              onClick={handleGiveBonus}
              disabled={!giverId || !receiverId}
              className={`w-full py-4 rounded-lg text-white font-semibold text-lg flex items-center justify-center gap-2 ${
                giverId && receiverId
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Gift className="w-6 h-6" />
              Bonuspunkte vergeben
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6 text-purple-900 text-sm">
            💡 <strong>Tipp:</strong> Bonuspunkte sind eine tolle Möglichkeit, 
            andere für gute Laune, Hilfsbereitschaft oder besondere Aktionen zu belohnen!
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
