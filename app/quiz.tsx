import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QuizCard } from "../components/QuizCard";
import { vocabularyData } from "../data/vocabulary";
import { useQuiz } from "../hooks/useQuiz";

export default function Quiz() {
  const { quizType } = useLocalSearchParams<{
    quizType: "multiple-choice" | "typing";
  }>();
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
    if (quizType) {
      generateQuestions(quizType);
    }
  }, [quizType]);

  useEffect(() => {
    if (isQuizCompleted) {
      setShowScoreModal(true);
    }
  }, [isQuizCompleted]);

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải câu hỏi...</Text>
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
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleRestart = () => {
    setShowScoreModal(false);
    resetQuiz();
    if (quizType) {
      generateQuestions(quizType);
    }
  };

  const handleGoHome = () => {
    setShowScoreModal(false);
    router.push("/");
  };

  const result = getResult();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          Câu {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            },
          ]}
        />
      </View>

      <QuizCard question={currentQuestion} onSubmit={submitAnswer} />

      <Modal visible={showScoreModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kết quả Quiz</Text>
            <Text style={styles.scoreText}>
              {result.score} / {result.total}
            </Text>
            <Text style={styles.percentageText}>
              {Math.round((result.score / result.total) * 100)}%
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.restartButton]}
                onPress={handleRestart}
              >
                <Text style={styles.modalButtonText}>Làm lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.homeButton]}
                onPress={handleGoHome}
              >
                <Text style={styles.modalButtonText}>Về trang chủ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4FE",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  exitButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff5252",
    justifyContent: "center",
    alignItems: "center",
  },
  exitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    minWidth: 300,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#4caf50",
    marginBottom: 10,
  },
  percentageText: {
    fontSize: 20,
    color: "#666",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
  },
  restartButton: {
    backgroundColor: "#ff9800",
  },
  homeButton: {
    backgroundColor: "#2196f3",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
