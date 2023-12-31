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

  /* LECTURE SESSIONS ***************************************/

  /** Gets all lecture sessions for the cohort
   * Returns: { count, next, previous, results }
   * where results: { id, title, status, api_url }
   */
  static async getLectureSessions() {
    const res = await this.request("lecturesessions/");

    return res.results;
  }

  /** Gets lecture session details.
   * Takes id
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

    if (url.includes("sophie")) {
      lectureSession.dri = {};
      lectureSession.dri.photo = (
        "https://rithm-students-media.s3.us-west-1.amazonaws.com/CACHE/images/user_photos/Sophie/f485ea5f-1091-4c2c-aaab-4ca681f5b0cb-Profile/50c318e46bc4dbebbe91731c3bf76640.jpg");
      return lectureSession;
    }

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

    return responses;
  }

  /* Events ***************************************/

  /** Gets all events for the cohort
   * Returns: { count, next, previous, results }
   * where results: { title, status, api_url }
   */
  static async getEvents() {
    const res = await this.request("events/");
    console.log("getEvents", res.results);

    return res.results;
  }

  /** Gets all events for the cohort with details
   * Takes a url
   * Returns: { id, title, description, exercise, cohort, dri, week_group,
   *            status, api_url, asset_set }
   */
  static async getEventDetailFromUrl(url) {
    const endpoint = url.match("events(.*)")[0];

    res = await this.request(endpoint);
    console.log("getEventDetailFromUrl", res);

    return res;
  }

  /** Gets all event details
   * Returns: [{ id, slug, title, description, cohort, dri, start_at, end_at,
   *             week_group, staff, location, week_group, status, api_url,
   *             asset_set }, ...]
   */
  static async getDetailedEvents(upcoming = false) {
    let events = await this.getEvents();

    const eventDetailPromises = events.map((e) =>
      this.getEventDetailFromUrl(e.api_url)
    );

    let responses = await Promise.all(eventDetailPromises);

    if (upcoming) {
      const now = new Date();

      responses = responses.filter((r) => new Date(r.end_at) > now);
    }

    return responses;
  }

  /* HOMEPAGE ***********************************/

  static async getHomepageItems(upcoming = false) {
    const lectureSessions = await this.getDetailedLectureSessions(upcoming);
    const events = await this.getDetailedEvents(upcoming);

    const items = lectureSessions.concat(events);
    return items.sort(this._sortByDate);
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

  /* AUTH ***************************************/

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
