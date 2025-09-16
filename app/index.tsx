import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const navigateToQuiz = (type: "multiple-choice" | "typing") => {
    router.push({
      pathname: "/quiz",
      params: { quizType: type },
    });
  };

  const navigateToVocabulary = () => {
    router.push("/vocabulary");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>English Learning App</Text>
      <Text style={styles.subtitle}>Chọn loại quiz để bắt đầu học:</Text>

      <View style={styles.quizSection}>
        <Text style={styles.sectionTitle}>Quiz với từ vựng mặc định</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToQuiz("multiple-choice")}
        >
          <Text style={styles.buttonText}>Trắc nghiệm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateToQuiz("typing")}
        >
          <Text style={styles.buttonText}>Viết từ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.personalSection}>
        <Text style={styles.sectionTitle}>Từ vựng cá nhân</Text>

        <TouchableOpacity
          style={styles.vocabularyButton}
          onPress={navigateToVocabulary}
        >
          <Text style={styles.vocabularyButtonText}>📚 Quản lý từ vựng</Text>
          <Text style={styles.vocabularyButtonSubtext}>
            Thêm, xóa và học từ vựng của riêng bạn
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  quizSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196f3",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    minWidth: 200,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "80%",
    marginVertical: 20,
  },
  personalSection: {
    width: "100%",
    alignItems: "center",
  },
  vocabularyButton: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 25,
    minWidth: 250,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  vocabularyButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  vocabularyButtonSubtext: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
  },
});
