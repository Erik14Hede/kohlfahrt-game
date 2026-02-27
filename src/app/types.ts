export type GameMode = "individual" | "teams";

export interface Participant {
  id: string;
  name: string;
  // Main currency: Pinkel
  pinkel: number;
  // Bonus currency: Mettenden
  mettenden: number;
  role: "host" | "player";
}

export interface RoomState {
  roomCode: string;
  tourName: string;
  gameMode: GameMode;
  participants: Participant[];
  // Controls what all players see
  stage: "lobby" | "scoreboard" | "quiz" | "winner";
  winnerId?: string;
  quiz?: QuizState;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correct: number;
}

export interface QuizState {
  status: "running" | "revealed";
  question: QuizQuestion;
  submissions: Record<string, number>; // participantId -> answerIndex
  awarded: boolean;
}
