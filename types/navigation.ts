import { QuizResult } from ".";

export type RootStackParamList = {
  index: undefined;
  Quiz: { quizType: "multiple-choice" | "typing" };
  Result: { result: QuizResult };
};
