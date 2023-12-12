import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LectureSessionList from "./LectureSessionList";
import { useFonts } from "expo-font";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Source-Serif": require("./assets/fonts/SourceSerif4-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LectureSessionList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
