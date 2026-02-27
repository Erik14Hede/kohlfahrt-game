import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import { Scoreboard } from './components/Scoreboard';
import { ManualScore } from './components/ManualScore';
import { BonusPoints } from './components/BonusPoints';
import { WinnerScreen } from './components/WinnerScreen';
import { QuizGame } from './components/QuizGame';
import { DrawingGame } from './components/DrawingGame';
import { TimelineGame } from './components/TimelineGame';

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Team {
  id: string;
  name: string;
  playerIds: string[];
  score: number;
}

export type GameMode = 'individual' | 'teams';
export type TeamMode = 'permanent' | 'perGame';
export type Screen = 'setup' | 'dashboard' | 'scoreboard' | 'manualScore' | 'bonusPoints' | 'winner' | 'quiz' | 'drawing' | 'timeline';

function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [gameMode, setGameMode] = useState<GameMode>('individual');
  const [teamMode, setTeamMode] = useState<TeamMode>('permanent');
  const [tourName, setTourName] = useState('');

  const addPoints = (playerId: string, points: number) => {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, score: p.score + points } : p
    ));
  };

  const addTeamPoints = (teamId: string, points: number) => {
    setTeams(prev => prev.map(t => 
      t.id === teamId ? { ...t, score: t.score + points } : t
    ));
  };

  const resetGame = () => {
    setPlayers([]);
    setTeams([]);
    setGameMode('individual');
    setTeamMode('permanent');
    setTourName('');
    setScreen('setup');
  };

  const getWinner = () => {
    if (gameMode === 'individual') {
      return players.reduce((max, p) => p.score > max.score ? p : max, players[0]);
    } else {
      const winningTeam = teams.reduce((max, t) => t.score > max.score ? t : max, teams[0]);
      return winningTeam;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {screen === 'setup' && (
        <SetupScreen
          players={players}
          setPlayers={setPlayers}
          teams={teams}
          setTeams={setTeams}
          gameMode={gameMode}
          setGameMode={setGameMode}
          teamMode={teamMode}
          setTeamMode={setTeamMode}
          tourName={tourName}
          setTourName={setTourName}
          onStart={() => setScreen('dashboard')}
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          tourName={tourName}
          gameMode={gameMode}
          players={players}
          teams={teams}
          onNavigate={setScreen}
        />
      )}

      {screen === 'scoreboard' && (
        <Scoreboard
          players={players}
          teams={teams}
          gameMode={gameMode}
          onBack={() => setScreen('dashboard')}
          onAnnounceWinner={() => setScreen('winner')}
        />
      )}

      {screen === 'manualScore' && (
        <ManualScore
          players={players}
          teams={teams}
          gameMode={gameMode}
          onAddPoints={gameMode === 'individual' ? addPoints : addTeamPoints}
          onBack={() => setScreen('dashboard')}
        />
      )}

      {screen === 'bonusPoints' && (
        <BonusPoints
          players={players}
          onAddPoints={addPoints}
          onBack={() => setScreen('dashboard')}
        />
      )}

      {screen === 'quiz' && (
        <QuizGame
          players={players}
          teams={teams}
          gameMode={gameMode}
          onAddPoints={gameMode === 'individual' ? addPoints : addTeamPoints}
          onBack={() => setScreen('dashboard')}
        />
      )}

      {screen === 'drawing' && (
        <DrawingGame
          players={players}
          teams={teams}
          gameMode={gameMode}
          onAddPoints={gameMode === 'individual' ? addPoints : addTeamPoints}
          onBack={() => setScreen('dashboard')}
        />
      )}

      {screen === 'timeline' && (
        <TimelineGame
          players={players}
          teams={teams}
          gameMode={gameMode}
          onAddPoints={gameMode === 'individual' ? addPoints : addTeamPoints}
          onBack={() => setScreen('dashboard')}
        />
      )}

      {screen === 'winner' && (
        <WinnerScreen
          winner={getWinner()}
          gameMode={gameMode}
          onReset={resetGame}
        />
      )}
    </div>
  );
}

export default App;
