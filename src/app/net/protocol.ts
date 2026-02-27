import type { GameMode, RoomState, QuizQuestion } from "../types";

export type ClientToServer =
  | { type: "join"; roomCode: string; name: string; role: "host" | "player" }
  | { type: "leave"; roomCode: string }
  | { type: "host/setMeta"; roomCode: string; tourName: string; gameMode: GameMode }
  | { type: "host/setStage"; roomCode: string; stage: RoomState["stage"] }
  | { type: "host/addPinkel"; roomCode: string; targetId: string; amount: number }
  | { type: "host/addMettenden"; roomCode: string; targetId: string; amount: number }
  | { type: "player/giveBonus"; roomCode: string; fromId: string; toId: string; amount: number }
  | { type: "quiz/start"; roomCode: string; question: QuizQuestion }
  | { type: "quiz/answer"; roomCode: string; fromId: string; answerIndex: number }
  | { type: "quiz/reveal"; roomCode: string }
  | { type: "quiz/next"; roomCode: string }
  | { type: "winner/calculate"; roomCode: string }
  | { type: "room/reset"; roomCode: string };

export type ServerToClient =
  | { type: "joined"; roomCode: string; selfId: string; state: RoomState }
  | { type: "state"; state: RoomState }
  | { type: "error"; message: string };
