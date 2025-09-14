import { Alert } from "react-native";

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
};
