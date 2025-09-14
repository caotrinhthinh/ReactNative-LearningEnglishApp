import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { QuizQuestion } from "../types";

interface QuizCardProps {
  question: QuizQuestion;
  onSubmit: (answer: string) => void;
}

export const QuizCard = ({ question, onSubmit }: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>("");
  const [typedAnswer, setTypedAnswer] = useState("");

  const handleSubmit = () => {
    const answer =
      question.type === "multiple-choice"
        ? selectedAnswer!
        : typedAnswer.trim();

    if (!answer.trim()) {
      Alert.alert("Please select or type an answer before submitting.");
      return;
    }

    onSubmit(answer);
    setSelectedAnswer(null);
    setTypedAnswer("");
  };

  if (question.type === "multiple-choice") {
    return (
      <View style={styles.container}>
        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === option && styles.selectedOption,
              ]}
              onPress={() => {
                setSelectedAnswer(option);
                onSubmit(option);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.questionText}>{question.question}</Text>

      <TextInput
        style={styles.textInput}
        value={typedAnswer}
        placeholder="Nhập câu trả lời của bạn..."
        onChangeText={setTypedAnswer}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          !typedAnswer.trim() && styles.disableButton,
        ]}
        onPress={handleSubmit}
        disabled={!typedAnswer.trim()}
      >
        <Text style={styles.submitButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 3,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  questionText: {
    color: "#333",
    marginBottom: 20,
    fontWeight: "600",
    fontSize: 18,
    textAlign: "center",
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#dee2e6",
  },
  selectedOption: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  optionText: {
    fontSize: 16,
    color: "#495057",
    textAlign: "center",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#1976d2",
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  submitButton: {
    backgroundColor: "#4caf50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  disableButton: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
