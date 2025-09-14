export interface Vocabulary {
  id: string;
  vietnamese: string;
  english: string;
  pronunciation?: string;
  level: "basic" | "intermediate" | "advanced";
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  type: "multiple-choice" | "typing";
}

export interface QuizResult {
  score: number;
  total: number;
  correctAnswers: string[];
  wrongAnswers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

export interface StudySession {
  date: Date;
  score: number;
  wordLearned: number;
}
