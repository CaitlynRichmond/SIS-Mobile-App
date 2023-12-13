import { useState } from "react";
import SISApi from "./api";

/** Lecture detail logical component
 * 
 * State
 * - lecture: 
 */


export default function LectureDetail() {

  const [lecture, setLecture] = useState(null);
  
  async function fetchLecture() {
    const lectureSessions = await SISApi.getLectureSessionById(lectureId);
    setLectureSessions(lectureSessions);
  }

  /** Effect for getting all companies on initial render. */

  useEffect(function fetchLectureSessionsWhenMounted() {
    fetchLectureSessions();
  }, []);
}