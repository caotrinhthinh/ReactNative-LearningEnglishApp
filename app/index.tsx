import { QuizCard } from "@/src/components/QuizCard";
import { QuizQuestion } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const questions: QuizQuestion[] = [
    {
      id: "1",
      question: "Apple nghĩa là gì?",
      correctAnswer: "Quả táo",
      options: ["Quả táo", "Quả chuối", "Quả cam"],
      type: "typing",
    },
  ];

  return (
    <SafeAreaView>
      <QuizCard
        question={questions[0]}
        onSubmit={(opt) => console.log("Bạn chọn: ", opt)}
      />
    </SafeAreaView>
  );
}
