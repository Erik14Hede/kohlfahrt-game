import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, X, ArrowLeft, Trophy } from 'lucide-react';
import { Player, Team, GameMode } from '../App';

interface QuizGameProps {
  players: Player[];
  teams: Team[];
  gameMode: GameMode;
  onAddPoints: (id: string, points: number) => void;
  onBack: () => void;
}

const quizQuestions = [
  {
    question: 'Was ist das Hauptgericht bei einer Kohlfahrt?',
    answers: ['Grünkohl mit Pinkel', 'Sauerkraut', 'Rotkohl', 'Weißkohl'],
    correct: 0
  },
  {
    question: 'Aus welcher Region stammt die Kohlfahrt-Tradition?',
    answers: ['Bayern', 'Nordrhein-Westfalen', 'Oldenburg/Norddeutschland', 'Sachsen'],
    correct: 2
  },
  {
    question: 'Was ist "Pinkel"?',
    answers: ['Ein Trinkspiel', 'Eine Wurst', 'Ein Kartenspiel', 'Ein Tanz'],
    correct: 1
  },
  {
    question: 'Wann findet traditionell eine Kohlfahrt statt?',
    answers: ['Im Sommer', 'Im Winter', 'Im Frühjahr', 'Im Herbst'],
    correct: 1
  },
  {
    question: 'Was wird bei einer Kohlfahrt traditionell gespielt?',
    answers: ['Fußball', 'Boßeln', 'Tennis', 'Golf'],
    correct: 1
  },
  {
    question: 'Wer wird am Ende einer Kohlfahrt gekürt?',
    answers: ['Kohlmeister', 'Kohlkönig/Kohlkönigin', 'Grünkohl-Champion', 'Pinkel-Prinz'],
    correct: 1
  }
];

export function QuizGame({ players, teams, gameMode, onAddPoints, onBack }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [gameFinished, setGameFinished] = useState(false);

  const question = quizQuestions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const handleNext = () => {
    if (selectedAnswer === question.correct && selectedParticipant) {
      const newScores = { ...scores };
      newScores[selectedParticipant] = (newScores[selectedParticipant] || 0) + 10;
      setScores(newScores);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setSelectedParticipant('');
    } else {
      setGameFinished(true);
    }
  };

  const handleFinish = () => {
    Object.entries(scores).forEach(([id, points]) => {
      onAddPoints(id, points);
    });
    alert('Quiz abgeschlossen! Punkte wurden vergeben.');
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
            <h1 className="text-4xl text-green-900 mb-6">Quiz abgeschlossen!</h1>
            
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl mb-4">🧠</h1>
            <h1 className="text-4xl text-green-900 mb-2">Kohlfahrt Quiz</h1>
            <p className="text-green-700">
              Frage {currentQuestion + 1} von {quizQuestions.length}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              className="bg-green-600 h-full"
            />
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-600 mb-6">
            <h2 className="text-2xl text-green-900 mb-6">{question.question}</h2>

            {/* Participant Selection */}
            {!showResult && (
              <div className="mb-6">
                <label className="block mb-2 text-green-900">
                  {gameMode === 'individual' ? 'Wer antwortet?' : 'Welches Team antwortet?'}
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
            )}

            {/* Answers */}
            <div className="space-y-3">
              {question.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && selectedParticipant && handleAnswer(index)}
                  disabled={showResult || !selectedParticipant}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showResult
                      ? index === question.correct
                        ? 'bg-green-100 border-green-500 text-green-900'
                        : selectedAnswer === index
                        ? 'bg-red-100 border-red-500 text-red-900'
                        : 'bg-gray-100 border-gray-300 text-gray-600'
                      : selectedParticipant
                      ? 'bg-white border-green-300 hover:border-green-500 hover:bg-green-50 text-green-900'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{answer}</span>
                    {showResult && (
                      index === question.correct ? (
                        <Check className="w-6 h-6 text-green-600" />
                      ) : selectedAnswer === index ? (
                        <X className="w-6 h-6 text-red-600" />
                      ) : null
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Result Message */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-lg ${
                  selectedAnswer === question.correct
                    ? 'bg-green-100 text-green-900'
                    : 'bg-red-100 text-red-900'
                }`}
              >
                {selectedAnswer === question.correct
                  ? '✓ Richtig! +10 Punkte'
                  : '✗ Leider falsch. Keine Punkte.'}
              </motion.div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {!showResult ? (
              <button
                onClick={onBack}
                className="w-full py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Abbrechen
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
              >
                {currentQuestion < quizQuestions.length - 1 ? 'Nächste Frage' : 'Quiz beenden'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
