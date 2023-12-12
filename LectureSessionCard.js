import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

/** Presentational component for a LectureSessionCard
 *
 * Props:
 * - lectureSession: { id, title, status, api_url }
 *
 * LectureSessionList -> LectureSessionCard
 */

export default function LectureSessionCard({ lectureSession }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{lectureSession.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

