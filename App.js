import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginForm from "./LoginForm";
import { useFonts } from "expo-font";
import SISApi from "./api";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homepage from "./Homepage";
import LectureDetail from "./LectureDetail";


export default function App() {
  const [fontsLoaded] = useFonts({
    "Source-Serif": require("./assets/fonts/SourceSerif4-Regular.ttf"),
  });

  const [token, setToken] = useState(null);
  const [cohort, setCohort] = useState(null);

  /**Logs in user */
  async function login(email, password, cohort) {
    const token = await SISApi.getToken(
      cohort,
      email,
      password
    );
    setToken(token);
    setCohort(cohort);
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

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name={`Welcome ${cohort}`} component={Homepage} />
        <Stack.Screen name="Lecture">
          {(props) => <LectureDetail {...props} />}
        </Stack.Screen>
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


