import LectureSessionList from "./LectureSessionList";
import { StyleSheet, View } from "react-native";

/** Presentational component for the home page */

export default function Homepage({ navigation }) {
  return (
    <View style={styles.container}>
      <LectureSessionList navigation={navigation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});