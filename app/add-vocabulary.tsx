import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Vocabulary } from "../types";

const STORAGE_KEY = "@personal_vocabulary";

export default function AddVocabularyScreen() {
  const [vietnamese, setVietnamese] = useState("");
  const [english, setEnglish] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState<"basic" | "intermediate" | "advanced">("basic");
  const [isLoading, setIsLoading] = useState(false);

  const saveVocabulary = async () => {
    if (!vietnamese.trim() || !english.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ từ tiếng Việt và tiếng Anh");
      return;
    }

    setIsLoading(true);
    try {
      // Lấy danh sách từ vựng hiện tại
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const existingVocabulary: Vocabulary[] = stored ? JSON.parse(stored) : [];

      // Tạo ID mới
      const newId = Date.now().toString();

      // Tạo từ vựng mới
      const newVocabulary: Vocabulary = {
        id: newId,
        vietnamese: vietnamese.trim(),
        english: english.trim(),
        pronunciation: pronunciation.trim() || undefined,
        level,
        category: category.trim() || "General",
      };

      // Thêm vào danh sách
      const updatedVocabulary = [...existingVocabulary, newVocabulary];

      // Lưu vào AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVocabulary));

      Alert.alert(
        "Thành công",
        "Đã thêm từ vựng thành công!",
        [
          {
            text: "Thêm tiếp",
            onPress: () => {
              setVietnamese("");
              setEnglish("");
              setPronunciation("");
              setCategory("");
              setLevel("basic");
            },
          },
          {
            text: "Quay lại",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Lỗi khi lưu từ vựng:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu từ vựng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Thêm từ vựng</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Từ tiếng Việt *</Text>
            <TextInput
              style={styles.input}
              value={vietnamese}
              onChangeText={setVietnamese}
              placeholder="Nhập từ tiếng Việt..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Từ tiếng Anh *</Text>
            <TextInput
              style={styles.input}
              value={english}
              onChangeText={setEnglish}
              placeholder="Nhập từ tiếng Anh..."
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phiên âm (tùy chọn)</Text>
            <TextInput
              style={styles.input}
              value={pronunciation}
              onChangeText={setPronunciation}
              placeholder="Ví dụ: /həˈloʊ/"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Danh mục (tùy chọn)</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Ví dụ: Greetings, Food, Travel..."
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mức độ</Text>
            <View style={styles.levelButtons}>
              {(["basic", "intermediate", "advanced"] as const).map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  style={[
                    styles.levelButton,
                    level === lvl && styles.selectedLevelButton,
                  ]}
                  onPress={() => setLevel(lvl)}
                >
                  <Text
                    style={[
                      styles.levelButtonText,
                      level === lvl && styles.selectedLevelButtonText,
                    ]}
                  >
                    {lvl === "basic" && "Cơ bản"}
                    {lvl === "intermediate" && "Trung bình"}
                    {lvl === "advanced" && "Nâng cao"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.disabledButton]}
            onPress={saveVocabulary}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "Đang lưu..." : "Lưu từ vựng"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4FE",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976d2",
  },
  placeholder: {
    width: 80,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  levelButtons: {
    flexDirection: "row",
    gap: 10,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    backgroundColor: "white",
  },
  selectedLevelButton: {
    backgroundColor: "#1976d2",
    borderColor: "#1976d2",
  },
  levelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  selectedLevelButtonText: {
    color: "white",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
