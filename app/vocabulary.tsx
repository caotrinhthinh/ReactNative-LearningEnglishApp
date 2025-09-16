import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Vocabulary } from "../types";

const STORAGE_KEY = "@personal_vocabulary";

export default function VocabularyManager() {
  const [personalVocabulary, setPersonalVocabulary] = useState<Vocabulary[]>(
    []
  );

  useEffect(() => {
    loadPersonalVocabulary();
  }, []);

  const loadPersonalVocabulary = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPersonalVocabulary(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Lỗi khi tải từ vựng:", error);
    }
  };

  const savePersonalVocabulary = async (vocab: Vocabulary[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(vocab));
      setPersonalVocabulary(vocab);
    } catch (error) {
      console.error("Lỗi khi lưu từ vựng:", error);
    }
  };

  const deleteVocabulary = (id: string) => {
    Alert.alert("Xóa từ vựng", "Bạn có chắc muốn xóa từ vựng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          const updatedVocab = personalVocabulary.filter(
            (item) => item.id !== id
          );
          savePersonalVocabulary(updatedVocab);
        },
      },
    ]);
  };

  const navigateToAddVocabulary = () => {
    router.push("/add-vocabulary");
  };

  const navigateToQuiz = (type: "multiple-choice" | "typing") => {
    if (personalVocabulary.length === 0) {
      Alert.alert(
        "Thông báo",
        "Bạn chưa có từ vựng nào. Hãy thêm từ vựng trước!"
      );
      return;
    }
    router.push({
      pathname: "/quiz",
      params: {
        quizType: type,
        usePersonal: "true",
      },
    });
  };

  const renderVocabularyItem = ({ item }: { item: Vocabulary }) => (
    <View style={styles.vocabularyItem}>
      <View style={styles.vocabContent}>
        <Text style={styles.vietnameseText}>{item.vietnamese}</Text>
        <Text style={styles.englishText}>{item.english}</Text>
        {item.pronunciation && (
          <Text style={styles.pronunciationText}>{item.pronunciation}</Text>
        )}
        <View style={styles.vocabMeta}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.levelText}>{item.level}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteVocabulary(item.id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Từ vựng của tôi</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Tổng số từ: {personalVocabulary.length}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToAddVocabulary}
        >
          <Text style={styles.addButtonText}>+ Thêm từ vựng</Text>
        </TouchableOpacity>

        {personalVocabulary.length > 0 && (
          <View style={styles.quizButtons}>
            <TouchableOpacity
              style={styles.quizButton}
              onPress={() => navigateToQuiz("multiple-choice")}
            >
              <Text style={styles.quizButtonText}>Quiz trắc nghiệm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quizButton}
              onPress={() => navigateToQuiz("typing")}
            >
              <Text style={styles.quizButtonText}>Quiz viết từ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {personalVocabulary.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có từ vựng nào</Text>
          <Text style={styles.emptySubtext}>
            Nhấn "Thêm từ vựng" để bắt đầu xây dựng bộ từ vựng của bạn
          </Text>
        </View>
      ) : (
        <FlatList
          data={personalVocabulary}
          keyExtractor={(item) => item.id}
          renderItem={renderVocabularyItem}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  statsText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  quizButtons: {
    flexDirection: "row",
    gap: 10,
  },
  quizButton: {
    flex: 1,
    backgroundColor: "#ff9800",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },
  quizButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  vocabularyItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  vocabContent: {
    flex: 1,
  },
  vietnameseText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 5,
  },
  englishText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  pronunciationText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 8,
  },
  vocabMeta: {
    flexDirection: "row",
    gap: 10,
  },
  categoryText: {
    fontSize: 12,
    color: "#4caf50",
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 12,
    color: "#ff9800",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 20,
  },
});
