import { View, FlatList } from "react-native";
import { useState, useEffect } from 'react';
import SISApi from "./api";
import LectureSessionCard from "./LectureSessionCard";

/** LectureSessionList logical component
 * 
 * State:
 * - lectureSessions: [{ id, title, status, api_url }, ...]
 * 
 * App -> LectureList
 */

export default function LectureSessionList() {
  const [lectureSessions, setLectureSessions] = useState(null);

  console.log("LectureSessionList rendering. lectureSessions=", lectureSessions);

  /** Get all lectureSessions from the API */

  async function fetchLectureSessions() {
    const lectureSessions = await SISApi.getLectureSessions();
    setLectureSessions(lectureSessions);
    console.log("LectureSessionList. updating lectureSessions=", lectureSessions);
  }

  /** Effect for getting all companies on initial render. */

  useEffect(function fetchLectureSessionsWhenMounted() {
    fetchLectureSessions();
  }, []);

  if (lectureSessions === null) {
    return (
      <View>
        <text>
          Loading...
        </text>
      </View>
    )
  }

  return (
    <View>
      <FlatList
        data={lectureSessions}
        renderItem={(ls) => <LectureSessionCard lectureSession={ls} />}
        keyExtractor={ls => ls.id}
      />
    </View>
  )
}