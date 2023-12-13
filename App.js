import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LectureSessionList from "./LectureSessionList";
import LoginForm from "./LoginForm";
import { useFonts } from "expo-font";
import SISApi from "./api";
import { useState } from "react";

const COHORT_ID_TO_URL = {
  R99: process.env.EXPO_PUBLIC_API_URL,
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "Source-Serif": require("./assets/fonts/SourceSerif4-Regular.ttf"),
  });

  const [token, setToken] = useState(null);

  /**Logs in user */
  async function login(email, password, cohort) {
    const token = await SISApi.getToken(
      COHORT_ID_TO_URL[cohort],
      email,
      password
    );
    setToken(token);
  }

  if (!fontsLoaded) {
    return null;
  }

  if (token === null) {
    return (
      <View style={styles.container}>
        <LoginForm login={login} />
      </View>
    );
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
