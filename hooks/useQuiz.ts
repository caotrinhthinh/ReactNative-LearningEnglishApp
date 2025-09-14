import { useState } from "react";
import { QuizQuestion, QuizResult, Vocabulary } from "../types";

export const useQuiz = (vocabularyList: Vocabulary[]) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const generateQuestions = (type: "multiple-choice" | "typing") => {
    const shuffled = [...vocabularyList].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, Math.min(10, shuffled.length));

    const quizQuestion: QuizQuestion[] = selectedWords.map((word) => {
      if (type === "multiple-choice") {
        // Tạo câu hỏi trắc nghiệm
        const wrongOptions = vocabularyList
          .filter((w) => w.id !== word.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((w) => w.english);

        const options = [...wrongOptions, word.english].sort(
          () => 0.5 - Math.random()
        );
        return {
          id: word.id,
          question: `"${word.vietnamese}" có nghĩa tiếng anh là gì?`,
          correctAnswer: word.english,
          options: options,
          type: "multiple-choice",
        };
      } else {
        return {
          id: word.id,
          question: `Viết tiếng Anh cho từ: "${word.vietnamese}"`,
          correctAnswer: word.english.toLowerCase(),
          options: [],
          type: "typing",
        };
      }
    });

    setQuestions(quizQuestion);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setIsQuizCompleted(false);
  };

  const submitAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      currentQuestion.type === "typing"
        ? answer.toLowerCase().trim() === currentQuestion.correctAnswer
        : answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setIsQuizCompleted(false);
  };

  const getResult = (): QuizResult => {
    const wrongAnswers = questions
      .map((q, index) => ({
        questions: q.question,
        userAnswers: userAnswers[index],
        correctAnswer: q.correctAnswer,
        isCorrect:
          q.type === "typing"
            ? userAnswers[index]?.toLowerCase().trim() === q.correctAnswer
            : userAnswers[index] === q.correctAnswer,
      }))
      .filter((item) => !item.isCorrect);

    return {
      score,
      total: questions.length,
      correctAnswers: userAnswers.filter((_, index) => {
        const q = questions[index];
        return q.type === "typing"
          ? userAnswers[index]?.toLowerCase().trim() === q.correctAnswer
          : userAnswers[index] === q.correctAnswer;
      }),
      wrongAnswers: wrongAnswers.map((item) => ({
        question: item.questions,
        userAnswer: item.userAnswers,
        correctAnswer: item.correctAnswer,
      })),
    };
  };

  return {
    questions,
    currentQuestionIndex,
    score,
    isQuizCompleted,
    currentQuestion: questions[currentQuestionIndex],
    generateQuestions,
    submitAnswer,
    resetQuiz,
    getResult,
    progress:
      questions.length > 0
        ? ((currentQuestionIndex + 1) / questions.length) * 100
        : 0,
  };
};
