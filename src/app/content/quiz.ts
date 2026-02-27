import type { QuizQuestion } from "../types";

/**
 * More content = more fun. Keep questions short for mobile.
 * Scoring suggestion: 1–3 Pinkel per correct answer.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "kohl-1",
    question: "Was ist das klassische Kohlfahrt-Essen?",
    answers: ["Grünkohl mit Pinkel", "Döner", "Labskaus", "Käsespätzle"],
    correct: 0,
  },
  {
    id: "kohl-2",
    question: "Was ist Pinkel?",
    answers: ["Ein Kartenspiel", "Eine Wurst", "Ein Wanderstock", "Ein Getränk"],
    correct: 1,
  },
  {
    id: "kohl-3",
    question: "Zu welcher Jahreszeit findet Kohlfahrt meist statt?",
    answers: ["Sommer", "Herbst", "Winter", "Frühling"],
    correct: 2,
  },
  {
    id: "kohl-4",
    question: "Welches Spiel ist bei Kohlfahrten besonders verbreitet?",
    answers: ["Boßeln", "Badminton", "Schach", "Minigolf"],
    correct: 0,
  },

  // Oldenburg / Norddeutschland
  {
    id: "kohl-5",
    question: "Womit wird Grünkohl oft serviert?",
    answers: ["Pinkel und Kassler", "Sushi und Wasabi", "Tacos", "Croissants"],
    correct: 0,
  },
  {
    id: "kohl-6",
    question: "Wie heißt die Person, die am Ende gekürt wird?",
    answers: ["Kohlkönig/Kohlkönigin", "Kohl-CEO", "Krautkapitän", "Pinkel-Papst"],
    correct: 0,
  },

  // Fun / general knowledge
  {
    id: "fun-1",
    question: "Wie viele Buchstaben hat das Wort „Grünkohl“?",
    answers: ["7", "8", "9", "10"],
    correct: 1, // G r ü n k o h l = 8
  },
  {
    id: "fun-2",
    question: "Was passt am besten zu einer Wintertour?",
    answers: ["Sonnenhut", "Regenschirm", "Handschuhe", "Badehose"],
    correct: 2,
  },
  {
    id: "fun-3",
    question: "„Boßeln“ ist am ehesten…",
    answers: ["Kegeln auf der Straße", "Schwimmen im Kanal", "Tanzen", "Angeln"],
    correct: 0,
  },
  {
    id: "fun-4",
    question: "Bonusfrage: Welche Farbe hat Grünkohl meistens?",
    answers: ["Blau", "Grün", "Rosa", "Schwarz"],
    correct: 1,
  },
];
