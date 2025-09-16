import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { QuizCard } from "../components/QuizCard";
import { vocabularyData } from "../data/vocabulary";
import { useQuiz } from "../hooks/useQuiz";
import { Vocabulary } from "../types";

const STORAGE_KEY = "@personal_vocabulary";

export default function QuizScreen() {
  const { quizType, usePersonal } = useLocalSearchParams<{ 
    quizType: "multiple-choice" | "typing";
    usePersonal?: string;
  }>();
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [vocabularyList, setVocabularyList] = useState<Vocabulary[]>([]);

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
  } = useQuiz(vocabularyList, vocabularyData);

  useEffect(() => {
    loadVocabularyData();
  }, []);

  useEffect(() => {
    if (quizType && vocabularyList.length > 0) {
      generateQuestions(quizType);
    }
  }, [quizType, vocabularyList]);

  useEffect(() => {
    if (isQuizCompleted) {
      setShowScoreModal(true);
    }
  }, [isQuizCompleted]);

  const loadVocabularyData = async () => {
    try {
      if (usePersonal === "true") {
        // Load personal vocabulary
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const personalVocab: Vocabulary[] = JSON.parse(stored);
          setVocabularyList(personalVocab);
        } else {
          Alert.alert(
            "Thông báo", 
            "Bạn chưa có từ vựng cá nhân nào. Sẽ sử dụng từ vựng mặc định.",
            [
              {
                text: "OK",
                onPress: () => setVocabularyList(vocabularyData)
              }
            ]
          );
        }
      } else {
        // Use default vocabulary
        setVocabularyList(vocabularyData);
      }
    } catch (error) {
      console.error("Lỗi khi tải từ vựng:", error);
      setVocabularyList(vocabularyData);
    }
  };

  if (!currentQuestion || vocabularyList.length === 0) {
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
        <View style={styles.headerInfo}>
          <Text style={styles.progressText}>
            Câu {currentQuestionIndex + 1} / {questions.length}
          </Text>
          {usePersonal === "true" && (
            <Text style={styles.personalLabel}>Từ vựng cá nhân</Text>
          )}
        </View>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
          ]} 
        />
      </View>

      <QuizCard 
        question={currentQuestion} 
        onSubmit={submitAnswer}
      />

      <Modal
        visible={showScoreModal}
        transparent={true}
        animationType="fade"
      >
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
  headerInfo: {
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1976d2",
  },
  personalLabel: {
    fontSize: 12,
    color: "#4caf50",
    fontWeight: "500",
    marginTop: 2,
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