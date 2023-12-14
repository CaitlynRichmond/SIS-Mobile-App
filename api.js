const COHORT_ID_TO_URL = {
  R99: process.env.EXPO_PUBLIC_API_URL,
  R88: "blah",
  R77: "lets try this",
  R34: "https://r34.students.rithmschool.com",
  R35: "https://r35.students.rithmschool.com",
};

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class SISApi {
  static BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/api";

  static token = "null";

  static COHORT_ID_TO_URL = COHORT_ID_TO_URL;

  static async request(endpoint, data = {}, method = "GET") {
    const url = new URL(`${this.BASE_URL}/${endpoint}`);

    let headers = {
      "content-type": "application/json",
      Accept: "application/json",
    };

    if (endpoint !== "-token") {
      headers.Authorization = `Token ${SISApi.token}`;
    }

    url.search = method === "GET" ? new URLSearchParams(data).toString() : "";

    // set to undefined since the body property cannot exist on a GET method
    const body = method !== "GET" ? JSON.stringify(data) : undefined;

    const resp = await fetch(url, { method, body, headers });

    //fetch API does not throw an error, have to dig into the resp for msgs
    if (!resp.ok) {
      console.error("API Error:", resp.statusText, resp.status);
      const error = await resp.json();

      throw error;
    }

    return await resp.json();
  }

  // Individual API routes

  /** Gets all lecture sessions for the cohort
   * Returns: { count, next, previous, results }
   * where results: { id, title, status, api_url }
   */
  static async getLectureSessions() {
    const res = await this.request("lecturesessions/");

    return res.results;
  }

  /** Gets all lecture sessions for the cohort
   * Returns: { id, lecture, title, description, cohort, dri, staff,
   *            week_group, start_at, end_at, asset_set, status, api_url }
   */
  static async getLectureSessionById(id) {
    const res = await this.request(`lecturesessions/${id}`);

    return res;
  }

  /** Adds DRI info to lectureSession object.
   * 
   * Takes lectureSession: { id, lecture, title, description, cohort, dri, staff,
   *            week_group, start_at, end_at, asset_set, status, api_url }
   * 
   * where dri is an API endpoint, e.g. http://domain/api/staff/elie
   * 
   * Returns: { id, lecture, title, description, cohort, dri, staff,
   *            week_group, start_at, end_at, asset_set, status, api_url }
   *
   * where dri: { username, first_name, last_name, pronunciation, nickname,
   *              formal_name, pronoun, bio, photo, location, api_url }
   */
  static async addDRIInfoToLectureSession(lectureSession) {

    const url = lectureSession.dri.match("staff(.*)")[0];

    lectureSession.dri = await this.request(url);

    return lectureSession;
  }

  /** Gets all lecture session details
   * Returns: [{ id, lecture, title, description, cohort, dri, staff,
   *            week_group, start_at, end_at, asset_set, status, api_url }, ...]
   */
  static async getDetailedLectureSessions(upcoming = false) {
    let lectureSessions = await this.getLectureSessions();

    const lectureSessionDetailPromises = lectureSessions.map((ls) =>
      this.getLectureSessionById(ls.id)
    );

    let responses = await Promise.all(lectureSessionDetailPromises);

    if (upcoming) {
      const now = new Date();

      responses = responses.filter((r) => new Date(r.end_at) > now);
    }

    return responses.sort(this._sortByDate);
  }

  static _sortByDate(a, b) {
    const aDate = new Date(a.start_at);
    const bDate = new Date(b.start_at);

    let comparison = 0;
    if (aDate > bDate) {
      comparison = 1;
    } else if (aDate < bDate) {
      comparison = -1;
    }
    return comparison;
  }

  /** Gets token for user based on login
   * Takes: cohortId, username, password
   */
  static async getToken(cohort, username, password) {
    this.BASE_URL = COHORT_ID_TO_URL[cohort] + "/api";
    const info = { username, password };
    const res = await this.request(`-token`, (data = info), (method = "POST"));

    this.token = res.token;

    return res.token;
  }
}
export default SISApi;
