import { QuizResult } from ".";

export type RootStackParamList = {
  Home: undefined;
  Quiz: { quizType: "multiple-choice" | "typing" };
  Result: { result: QuizResult };
};
