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
  const { id } = route.params;

  const startDate = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const endDate = { hour: "numeric", minute: "numeric" };

  async function fetchLecture() {
    const lectureSession = await SISApi.getLectureSessionByIdWithDRIInfo(id);
    console.log(lectureSession.dri);
    setLecture(lectureSession);
  }
  console.log(lecture)
  /** Effect for getting all companies on initial render. */

  useEffect(function fetchLectureWhenMounted() {
    fetchLecture();
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
      <Text style={styles.title}>{lecture.title}</Text>
      <Text style={styles.description}>{lecture.description}</Text>
      <Text style={styles.date}>
        {"\n"}
        {new Date(lecture.start_at).toLocaleString(undefined, startDate)} -{" "}
        {new Date(lecture.end_at).toLocaleString(undefined, endDate)}
      </Text>
      <Text>
        Instructor: {lecture.dri.first_name}
      </Text>
      <Image
        source={{ url: lecture.dri.photo }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 16,
    color: "white",
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
