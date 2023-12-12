import { View, Text, StyleSheet } from "react-native";

/** Presentational component for a LectureSessionCard
 *
 * Props:
 * - lectureSession: { id, title, status, api_url }
 *
 * LectureSessionList -> LectureSessionCard
 */

export default function LectureSessionCard({ lectureSession }) {
  const options = { month: "short", day: "numeric" };
  return (
    <View style={styles.item}>
      <Text style={styles.date}>
        {new Date(lectureSession.start_at).toLocaleDateString(
          undefined,
          options
        )}
      </Text>
      <Text style={styles.title}>{lectureSession.title}</Text>
      <Text style={styles.description}>{lectureSession.description}</Text>
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
  },
});
