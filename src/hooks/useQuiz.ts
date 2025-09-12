import { useState } from "react";
import { QuizQuestion, Vocabulary } from "../types";

export const useQuiz = (vocabularyList: Vocabulary[]) => {
  const [question, setQuestion] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
};
