import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { vocabularyData } from "../data/vocabulary";
import { useQuiz } from "../hooks/useQuiz";

interface QuizScreenProps {
  route: {
    params: {
      quizType: "multiple-choice" | "typing";
    };
  };
  navigation: any;
}

export const QuizScreen = ({ route, navigation }: QuizScreenProps) => {
  const { quizType } = route.params;
  const [showScoreModal, setShowScoreModal] = useState(false);

  const {
    questions,
    currentQuestion,
    currentQuestionIndex,
    score,
    isQuizCompleted,
    generateQuestions,
    submitAnswer,
    resetQuiz,
    getResult,
  } = useQuiz(vocabularyData);

  useEffect(() => {
    generateQuestions(quizType);
  }, [quizType]);

  useEffect(() => {
    if (isQuizCompleted) {
      setShowScoreModal(true);
    }
  }, [isQuizCompleted]);

  if (!currentQuestion) {
    return (
      <SafeAreaView>
        <View>
          <Text>Đang tải câu hỏi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleExit = () => {
    Alert.alert(
      "Thoát quiz",
      "Bạn có chắc muốn thoát? Kết quả sẽ không được lưu.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Thoát",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleRestart = () => {
    setShowScoreModal(false);
    resetQuiz();
    generateQuestions(quizType);
  };

  const handleGoHome = () => {
    setShowScoreModal(false);
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Quiz Screen</Text>
      </View>
    </SafeAreaView>
  );
};
