import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Trophy } from 'lucide-react';
import { Player, Team, GameMode } from '../App';

interface TimelineGameProps {
  players: Player[];
  teams: Team[];
  gameMode: GameMode;
  onAddPoints: (id: string, points: number) => void;
  onBack: () => void;
}

interface HistoricEvent {
  event: string;
  year: number;
}

const historicEvents: HistoricEvent[][] = [
  [
    { event: 'Gründung der Bundesrepublik Deutschland', year: 1949 },
    { event: 'Fall der Berliner Mauer', year: 1989 },
    { event: 'Deutsche Wiedervereinigung', year: 1990 },
    { event: 'Einführung des Euro', year: 2002 }
  ],
  [
    { event: 'Erster Weltkrieg beginnt', year: 1914 },
    { event: 'Zweiter Weltkrieg endet', year: 1945 },
    { event: 'Deutschland wird Fußball-Weltmeister (erste WM-Titel)', year: 1954 },
    { event: 'Olympische Spiele in München', year: 1972 }
  ],
  [
    { event: 'Erfindung des Automobils (Benz)', year: 1885 },
    { event: 'Erstes Telefon in Deutschland', year: 1877 },
    { event: 'Erste U-Bahn in Berlin', year: 1902 },
    { event: 'Erstes deutsches Fernsehprogramm', year: 1952 }
  ]
];

export function TimelineGame({ players, teams, gameMode, onAddPoints, onBack }: TimelineGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [userOrder, setUserOrder] = useState<HistoricEvent[]>([]);
  const [availableEvents, setAvailableEvents] = useState<HistoricEvent[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [gameFinished, setGameFinished] = useState(false);

  const startGame = () => {
    if (selectedParticipant) {
      const events = [...historicEvents[currentRound]].sort(() => Math.random() - 0.5);
      setAvailableEvents(events);
      setUserOrder([]);
      setGameStarted(true);
    }
  };

  const addToTimeline = (event: HistoricEvent) => {
    setUserOrder([...userOrder, event]);
    setAvailableEvents(availableEvents.filter(e => e !== event));
  };

  const removeFromTimeline = (event: HistoricEvent) => {
    setAvailableEvents([...availableEvents, event]);
    setUserOrder(userOrder.filter(e => e !== event));
  };

  const checkAnswer = () => {
    const sortedCorrect = [...historicEvents[currentRound]].sort((a, b) => a.year - b.year);
    const correct = JSON.stringify(userOrder.map(e => e.event)) === JSON.stringify(sortedCorrect.map(e => e.event));
    
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const newScores = { ...scores };
      newScores[selectedParticipant] = (newScores[selectedParticipant] || 0) + 25;
      setScores(newScores);
    }
  };

  const nextRound = () => {
    if (currentRound < historicEvents.length - 1) {
      setCurrentRound(prev => prev + 1);
      setGameStarted(false);
      setShowResult(false);
      setSelectedParticipant('');
      setUserOrder([]);
      setAvailableEvents([]);
    } else {
      setGameFinished(true);
    }
  };

  const handleFinish = () => {
    Object.entries(scores).forEach(([id, points]) => {
      onAddPoints(id, points);
    });
    alert('Zeitstrahl-Spiel abgeschlossen! Punkte wurden vergeben.');
    onBack();
  };

  if (gameFinished) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-500" />
            <h1 className="text-4xl text-green-900 mb-6">Spiel abgeschlossen!</h1>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600 mb-6">
              <h2 className="text-2xl text-green-900 mb-4">Ergebnisse</h2>
              <div className="space-y-3">
                {Object.entries(scores).map(([id, points]) => {
                  const name = gameMode === 'individual'
                    ? players.find(p => p.id === id)?.name
                    : teams.find(t => t.id === id)?.name;
                  return (
                    <div key={id} className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                      <span className="text-green-900">{name}</span>
                      <span className="text-xl text-green-900">{points} Punkte</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
            >
              Punkte übernehmen & Zurück
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-5xl mb-4">📅</h1>
              <h1 className="text-4xl text-green-900 mb-2">Zeitstrahl</h1>
              <p className="text-green-700">Ordne historische Ereignisse</p>
              <p className="text-green-700 mt-2">Runde {currentRound + 1} von {historicEvents.length}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-600 mb-6">
              <div className="mb-6">
                <label className="block mb-2 text-green-900">
                  {gameMode === 'individual' ? 'Wer spielt?' : 'Welches Team spielt?'}
                </label>
                <select
                  value={selectedParticipant}
                  onChange={(e) => setSelectedParticipant(e.target.value)}
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

              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-900">
                  📝 <strong>Anleitung:</strong> Ordne die Ereignisse von alt nach neu (oben = älter, unten = neuer)
                </p>
              </div>

              <button
                onClick={startGame}
                disabled={!selectedParticipant}
                className={`w-full py-4 rounded-lg text-white font-semibold text-lg ${
                  selectedParticipant
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Runde starten
              </button>
            </div>

            <button
              onClick={onBack}
              className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Zurück
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl text-green-900 mb-2">📅 Zeitstrahl</h1>
            <p className="text-green-700">Runde {currentRound + 1} von {historicEvents.length}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600 mb-6">
            {/* Available Events */}
            {availableEvents.length > 0 && !showResult && (
              <div className="mb-6">
                <h3 className="text-lg text-green-900 mb-3">Verfügbare Ereignisse:</h3>
                <div className="space-y-2">
                  {availableEvents.map((event, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => addToTimeline(event)}
                      className="w-full p-3 bg-gray-100 hover:bg-green-100 border-2 border-gray-300 hover:border-green-400 rounded-lg text-left transition-all"
                    >
                      {event.event}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="mb-6">
              <h3 className="text-lg text-green-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Zeitstrahl (von alt nach neu):
              </h3>
              {userOrder.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  Wähle Ereignisse aus, um den Zeitstrahl zu füllen
                </div>
              ) : (
                <div className="space-y-2 relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-300" />
                  
                  {userOrder.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 relative z-10">
                          {index + 1}
                        </div>
                        <button
                          onClick={() => !showResult && removeFromTimeline(event)}
                          disabled={showResult}
                          className={`flex-1 p-3 rounded-lg border-2 text-left ${
                            showResult
                              ? isCorrect
                                ? 'bg-green-100 border-green-500'
                                : 'bg-red-100 border-red-500'
                              : 'bg-green-50 border-green-300 hover:bg-green-100'
                          }`}
                        >
                          <div>{event.event}</div>
                          {showResult && (
                            <div className="text-sm mt-1 text-gray-600">
                              {event.year}
                            </div>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            {!showResult && availableEvents.length === 0 && (
              <button
                onClick={checkAnswer}
                className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
              >
                Überprüfen
              </button>
            )}

            {/* Result */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-lg mb-4 ${
                  isCorrect
                    ? 'bg-green-100 text-green-900'
                    : 'bg-red-100 text-red-900'
                }`}
              >
                <div className="text-center text-2xl mb-2">
                  {isCorrect ? '✓ Richtig!' : '✗ Leider falsch'}
                </div>
                <div className="text-center">
                  {isCorrect ? '+25 Punkte' : 'Keine Punkte'}
                </div>
              </motion.div>
            )}

            {/* Next Button */}
            {showResult && (
              <button
                onClick={nextRound}
                className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
              >
                {currentRound < historicEvents.length - 1 ? 'Nächste Runde' : 'Spiel beenden'}
              </button>
            )}
          </div>

          {!showResult && (
            <button
              onClick={onBack}
              className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Abbrechen
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
