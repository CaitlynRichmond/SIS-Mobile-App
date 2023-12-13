import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

/** */
export default function LoginForm({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cohort, setCohort] = useState("");

  const [loginErrors, setLoginErrors] = useState([]);

  async function handleSubmit(evt) {
    try {
      await login(email, password, cohort);
    } catch (errors) {
      setLoginErrors(errors);
    }
    // console.log(email, password, cohort)
    // await login(email, password, cohort);
  }
  console.log("Setting loginErrors=", loginErrors);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* { loginErrors.length !== 0 && (
        <View>
          {loginErrors.map(error => <Text>{error}</Text>)}
        </View>
      )} */}

      {loginErrors.non_field_errors !== 0 && (
        <View>{<Text>{loginErrors.non_field_errors}</Text>}</View>
      )}
        {loginErrors.username !== 0 && (
        <View>{<Text>{loginErrors.username}</Text>}</View>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      {loginErrors.password !== 0 && (
        <View>{<Text>{loginErrors.password}</Text>}</View>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Cohort Id"
          placeholderTextColor="#003f5c"
          onChangeText={(cohort) => setCohort(cohort)}
        />
      </View>
      <TouchableOpacity onPress={handleSubmit} style={styles.loginBtn}>
        <Text>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#fbaaaa",
    borderRadius: 30,
    width: 250,
    height: 45,
    marginBottom: 20,
    justifyContent: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 125,
    marginTop: 40,
    backgroundColor: "#f86161",
  },
});
