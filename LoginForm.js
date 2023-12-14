import SISApi from "./api";
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
import { SelectList } from "react-native-dropdown-select-list";

/** */
export default function LoginForm({ login }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cohort, setCohort] = useState("");

  const [loginErrors, setLoginErrors] = useState({});

  async function handleSubmit(evt) {
    try {
      await login(email, password, cohort);
    } catch (errors) {
      setLoginErrors(errors);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image style={styles.image}
        source={require('./assets/images/rithm-full.png')}
      />
      {loginErrors.non_field_errors && (
        <View>{<Text>{loginErrors.non_field_errors}</Text>}</View>
      )}
      {loginErrors.username && (
        <View>{<Text>{loginErrors.username}</Text>}</View>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
        />
      </View>
      {loginErrors.password && (
        <View>{<Text>{loginErrors.password}</Text>}</View>
      )}
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputView}>
        <SelectList
          data={Object.keys(SISApi.COHORT_ID_TO_URL)}
          setSelected={(cohort) => setCohort(cohort)}
          search={false}
          boxStyles={styles.box}
          dropdownStyles={styles.dropdown}
          placeholder="Select Cohort"
          placeholderTextColor="#003f5c"
        />
      </View>
      <TouchableOpacity onPress={handleSubmit} style={styles.loginBtn}>
        <Text>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  box: {
    borderWidth: 0,
  },
  image: {
    alignSelf: "center",
    marginBottom: 10

  },

  dropdown: {
    backgroundColor: "#fbaaaa",
    width: "100%",
    marginTop: 55,
    fontSize: 12,
    position: "absolute",
    zIndex: 999,
  },
  inputView: {
    backgroundColor: "#fbaaaa",
    borderRadius: 30,
    marginVertical: 10,
    width: 250,
    height: 45,
    justifyContent: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    marginLeft: 20,
  },
  loginBtn: {
    marginVertical: 10,
    borderRadius: 25,
    height: 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 125,
    backgroundColor: "#f86161",
    zIndex: -1,
  },
});
