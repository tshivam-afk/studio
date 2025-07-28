export type Question = {
  id: number;
  userAnswer: string | null;
};

export type QuizResult = {
  score: number;
  totalPossibleScore: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  recommendations: string[];
  incorrectlyAnswered: { q: number; userAnswer: string; correctAnswer: string }[];
  unattemptedQuestions: { q: number; correctAnswer: string }[];
};

export type AnswerKey = {
  [key: number]: string;
};
