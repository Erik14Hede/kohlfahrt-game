import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Shuffle, Play } from 'lucide-react';
import { Player, Team, GameMode, TeamMode } from '../App';

interface SetupScreenProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  teamMode: TeamMode;
  setTeamMode: React.Dispatch<React.SetStateAction<TeamMode>>;
  tourName: string;
  setTourName: React.Dispatch<React.SetStateAction<string>>;
  onStart: () => void;
}

export function SetupScreen({
  players,
  setPlayers,
  teams,
  setTeams,
  gameMode,
  setGameMode,
  teamMode,
  setTeamMode,
  tourName,
  setTourName,
  onStart
}: SetupScreenProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [teamCount, setTeamCount] = useState(2);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers(prev => [...prev, {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        score: 0
      }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const createRandomTeams = () => {
    if (players.length < teamCount) {
      alert('Nicht genug Spieler für diese Anzahl Teams!');
      return;
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const newTeams: Team[] = [];
    
    for (let i = 0; i < teamCount; i++) {
      newTeams.push({
        id: `team-${i}`,
        name: `Team ${i + 1}`,
        playerIds: [],
        score: 0
      });
    }

    shuffled.forEach((player, index) => {
      newTeams[index % teamCount].playerIds.push(player.id);
    });

    setTeams(newTeams);
  };

  const canStart = players.length >= 2 && tourName.trim() !== '' && 
    (gameMode === 'individual' || (gameMode === 'teams' && teams.length > 0));

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            🥬
          </motion.h1>
          <h1 className="text-4xl mb-2 text-green-900">Kohlfahrt Spielen</h1>
          <p className="text-green-700">Oldenburg Grünkohl Tradition</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-600">
          {/* Tour Name */}
          <div className="mb-6">
            <label className="block mb-2 text-green-900">Tour Name</label>
            <input
              type="text"
              value={tourName}
              onChange={(e) => setTourName(e.target.value)}
              placeholder="z.B. Kohlfahrt 2026"
              className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
            />
          </div>

          {/* Game Mode Selection */}
          <div className="mb-6">
            <label className="block mb-2 text-green-900">Spielmodus</label>
            <div className="flex gap-4">
              <button
                onClick={() => setGameMode('individual')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  gameMode === 'individual'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-green-900 border-green-300 hover:border-green-500'
                }`}
              >
                <Users className="inline mr-2 w-5 h-5" />
                Einzelspieler
              </button>
              <button
                onClick={() => setGameMode('teams')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                  gameMode === 'teams'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-green-900 border-green-300 hover:border-green-500'
                }`}
              >
                <Users className="inline mr-2 w-5 h-5" />
                Teams
              </button>
            </div>
          </div>

          {/* Team Mode (only for teams) */}
          {gameMode === 'teams' && (
            <div className="mb-6">
              <label className="block mb-2 text-green-900">Team-Modus</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTeamMode('permanent')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all text-sm ${
                    teamMode === 'permanent'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-green-900 border-green-300 hover:border-green-500'
                  }`}
                >
                  Feste Teams
                </button>
                <button
                  onClick={() => setTeamMode('perGame')}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all text-sm ${
                    teamMode === 'perGame'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-green-900 border-green-300 hover:border-green-500'
                  }`}
                >
                  Pro Spiel
                </button>
              </div>
            </div>
          )}

          {/* Add Players */}
          <div className="mb-6">
            <label className="block mb-2 text-green-900">Teilnehmer hinzufügen</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Name eingeben"
                className="flex-1 px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
              />
              <button
                onClick={addPlayer}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Players List */}
          {players.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-green-900">Teilnehmer ({players.length})</h3>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {players.map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg border border-green-200"
                  >
                    <span className="text-green-900">{player.name}</span>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Team Creation */}
          {gameMode === 'teams' && players.length >= 2 && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <h3 className="mb-3 text-green-900">Teams erstellen</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="number"
                  min="2"
                  max={players.length}
                  value={teamCount}
                  onChange={(e) => setTeamCount(Number(e.target.value))}
                  className="w-20 px-3 py-2 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
                />
                <button
                  onClick={createRandomTeams}
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Zufällige Teams erstellen
                </button>
              </div>

              {teams.length > 0 && (
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div key={team.id} className="bg-white p-3 rounded-lg border border-green-300">
                      <div className="text-green-900 mb-1">{team.name}</div>
                      <div className="text-sm text-green-700">
                        {team.playerIds.map(id => players.find(p => p.id === id)?.name).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={onStart}
            disabled={!canStart}
            className={`w-full py-4 rounded-lg text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              canStart
                ? 'bg-green-600 hover:bg-green-700 hover:scale-105'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <Play className="w-6 h-6" />
            Kohlfahrt starten!
          </button>
        </div>

        <div className="text-center mt-6 text-green-700 text-sm">
          🌭 Grünkohl & Pinkel Tradition 🥬
        </div>
      </motion.div>
    </div>
  );
}
