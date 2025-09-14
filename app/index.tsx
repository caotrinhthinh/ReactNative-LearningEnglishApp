import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const navigateToQuiz = (type: "multiple-choice" | "typing") => {
    router.push({
      pathname: "/quiz",
      params: { quizType: type },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>English Learning App</Text>
      <Text style={styles.subtitle}>Chọn loại quiz để bắt đầu học:</Text>

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
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196f3",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    minWidth: 200,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
