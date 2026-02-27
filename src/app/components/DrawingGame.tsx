import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pencil, Eraser, RotateCcw, ArrowLeft, Send } from 'lucide-react';
import { Player, Team, GameMode } from '../App';

interface DrawingGameProps {
  players: Player[];
  teams: Team[];
  gameMode: GameMode;
  onAddPoints: (id: string, points: number) => void;
  onBack: () => void;
}

const drawingPrompts = [
  'Grünkohl',
  'Pinkel Wurst',
  'Bollerwagen',
  'Boßeln',
  'Bierglas',
  'Krone',
  'Norddeutschland',
  'Winter',
  'Wanderung'
];

export function DrawingGame({ players, teams, gameMode, onAddPoints, onBack }: DrawingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [drawer, setDrawer] = useState('');
  const [guesser, setGuesser] = useState('');
  const [guess, setGuess] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [gameStarted]);

  const startGame = () => {
    if (drawer && guesser && drawer !== guesser) {
      const randomPrompt = drawingPrompts[Math.floor(Math.random() * drawingPrompts.length)];
      setCurrentPrompt(randomPrompt);
      setGameStarted(true);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmitGuess = () => {
    setShowAnswer(true);
  };

  const handleCorrect = () => {
    onAddPoints(guesser, 20);
    onAddPoints(drawer, 10);
    alert('Richtig geraten! Beide bekommen Punkte!');
    resetGame();
  };

  const handleWrong = () => {
    alert('Leider falsch!');
    resetGame();
  };

  const resetGame = () => {
    setGameStarted(false);
    setDrawer('');
    setGuesser('');
    setGuess('');
    setCurrentPrompt('');
    setShowAnswer(false);
    clearCanvas();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-5xl mb-4">🎨</h1>
              <h1 className="text-4xl text-green-900 mb-2">Mal-Spiel</h1>
              <p className="text-green-700">Male etwas und lass es erraten!</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-green-600 mb-6">
              <div className="mb-6">
                <label className="block mb-2 text-green-900">
                  {gameMode === 'individual' ? 'Wer malt?' : 'Welches Team malt?'}
                </label>
                <select
                  value={drawer}
                  onChange={(e) => setDrawer(e.target.value)}
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

              {drawer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6"
                >
                  <label className="block mb-2 text-green-900">
                    {gameMode === 'individual' ? 'Wer rät?' : 'Welches Team rät?'}
                  </label>
                  <select
                    value={guesser}
                    onChange={(e) => setGuesser(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none bg-white"
                  >
                    <option value="">Auswählen...</option>
                    {gameMode === 'individual'
                      ? players.filter(p => p.id !== drawer).map(player => (
                          <option key={player.id} value={player.id}>{player.name}</option>
                        ))
                      : teams.filter(t => t.id !== drawer).map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))
                    }
                  </select>
                </motion.div>
              )}

              <button
                onClick={startGame}
                disabled={!drawer || !guesser}
                className={`w-full py-4 rounded-lg text-white font-semibold text-lg ${
                  drawer && guesser
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Spiel starten
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl text-green-900 mb-2">🎨 Mal-Spiel</h1>
            {!showAnswer && (
              <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block text-xl">
                Male: <strong>{currentPrompt}</strong>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-600 mb-6">
            {/* Drawing Tools */}
            <div className="mb-4 flex flex-wrap gap-3 items-center">
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === c ? 'border-green-600 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setLineWidth(2)}
                  className={`px-3 py-1 rounded ${lineWidth === 2 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  Dünn
                </button>
                <button
                  onClick={() => setLineWidth(5)}
                  className={`px-3 py-1 rounded ${lineWidth === 5 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  Mittel
                </button>
                <button
                  onClick={() => setLineWidth(10)}
                  className={`px-3 py-1 rounded ${lineWidth === 10 ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  Dick
                </button>
              </div>

              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Löschen
              </button>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-96 border-4 border-green-300 rounded-lg cursor-crosshair bg-white touch-none"
            />

            {/* Guess Input */}
            {!showAnswer && (
              <div className="mt-6">
                <label className="block mb-2 text-green-900">
                  Rate, was gemalt wurde:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Deine Vermutung..."
                    className="flex-1 px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-600 focus:outline-none"
                  />
                  <button
                    onClick={handleSubmitGuess}
                    disabled={!guess.trim()}
                    className={`px-6 py-3 rounded-lg text-white flex items-center gap-2 ${
                      guess.trim()
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                    Absenden
                  </button>
                </div>
              </div>
            )}

            {/* Answer Reveal */}
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-green-50 p-6 rounded-lg border-2 border-green-300"
              >
                <div className="text-center mb-4">
                  <p className="text-lg text-green-900 mb-2">
                    <strong>Richtig war:</strong> {currentPrompt}
                  </p>
                  <p className="text-lg text-green-900">
                    <strong>Geraten wurde:</strong> {guess}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleCorrect}
                    className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg"
                  >
                    ✓ Richtig! (+30 Punkte)
                  </button>
                  <button
                    onClick={handleWrong}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-lg"
                  >
                    ✗ Falsch
                  </button>
                </div>
              </motion.div>
            )}
          </div>

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
