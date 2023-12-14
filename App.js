import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SISApi from "./api";

import Homepage from "./Homepage";
import LoginForm from "./LoginForm";
import LectureDetail from "./LectureDetail";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Source-Serif": require("./assets/fonts/SourceSerif4-Regular.ttf"),
  });

  const [info, setInfo] = useState({
    token: null,
    cohort: null,
  });

  /**Logs in user */
  async function login(email, password, cohort) {
    const token = await SISApi.getToken(cohort, email, password);
    setInfo({ token, cohort });
  }

  if (!fontsLoaded) {
    return null;
  }

  if (info.token === null) {
    return (
      <View style={styles.container}>
        <LoginForm login={login} />
      </View>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={`Welcome ${info.cohort}`} component={Homepage} />
        <Stack.Screen name="Lecture" component={LectureDetail} />
      </Stack.Navigator>
    </NavigationContainer>
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
