import { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, Text, Image } from "react-native";
import SISApi from "./api";

/** Lecture detail logical component
 *
 * State
 * - lecture:
 */

export default function LectureDetail({ route, navigation }) {
  
  const [lecture, setLecture] = useState(null);

  const startDate = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const endDate = { hour: "numeric", minute: "numeric" };

  async function fetchDRIInfo() {
    let { lectureSession } = route.params;
    console.log("BEFORE lectureSession=", lectureSession)
    if (typeof lectureSession.dri === String) {
      lectureSession = await SISApi.addDRIInfoToLectureSession(lectureSession);
    }
    console.log("BEFORE lectureSession=", lectureSession)
    setLecture(lectureSession);
  }

  /** Effect for getting all companies on initial render. */
  useEffect(function fetchDRIInfoWhenMounted() {
    fetchDRIInfo();
  }, []);

  if (lecture === null) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.item}>
      <Text style={styles.date}>
        {new Date(lecture.start_at).toLocaleString(undefined, startDate)} -{" "}
        {new Date(lecture.end_at).toLocaleString(undefined, endDate)}
      </Text>
      <Text style={styles.title}>{lecture.title}</Text>
      <Text style={styles.description}>{lecture.description}</Text>

      <Image style={styles.image} source={{url:  lecture.dri.photo}} />

    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 16,
    color: "white",
  },
  image: {
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 100,
    height: 100,
    width: 100,

  },
  item: {
    backgroundColor: "#f86161",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  title: {
    fontFamily: "Source-Serif",
    fontSize: 32,
    color: "white",
  },
  description: {
    fontSize: 16,
    fontFamily: "Source-Serif",
  },
});
