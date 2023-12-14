import {ActivityIndicator, View, FlatList, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import SISApi from "./api";
import LectureSessionCard from "./LectureSessionCard";

/** LectureSessionList logical component
 *
 * State:
 * - lectureSessions: [{ id, title, status, api_url }, ...]
 *
 * App -> LectureList
 */

export default function LectureSessionList({ navigation }) {
  const [lectureSessions, setLectureSessions] = useState(null);

  /** Get all lectureSessions from the API */
  async function fetchLectureSessions() {
    const lectureSessions = await SISApi.getDetailedLectureSessions(true);
    setLectureSessions(lectureSessions);
  }

  /** Effect for getting all companies on initial render. */
  useEffect(function fetchLectureSessionsWhenMounted() {
    fetchLectureSessions();
  }, []);

  if (lectureSessions === null) {
    return (
      <View>
        <ActivityIndicator size='large'/>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={lectureSessions}
        renderItem={({ item }) => (
          <LectureSessionCard lectureSession={item} navigation={navigation} />
        )}
        keyExtractor={(ls) => ls.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 64,
    fontFamily: "Source-Serif",
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
});
