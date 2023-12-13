/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class SISApi {
  static BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  static token = "d64f4e1f88ede5b873d02403ce279c944517bad5";

  static async request(endpoint, data = {}, method = "GET") {
    const url = new URL(`${this.BASE_URL}/${endpoint}`);
    const headers = {
      Authorization: `Token ${SISApi.token}`,
      "content-type": "application/json",
      Accept: "application/json",
    };

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

  /** Gets all lecture session details
   * Returns: [{ id, lecture, title, description, cohort, dri, staff,
   *            week_group, start_at, end_at, asset_set, status, api_url }, ...]
   */
  static async getDetailedLectureSessions(upcoming = false) {
    let lectureSessions = await this.getLectureSessions();
    // lectureSessions = lectureSessions.filter((ls) => ls.id === 5);

    const lectureSessionDetailPromises = lectureSessions.map((ls) =>
      this.getLectureSessionById(ls.id)
    );

    let responses = await Promise.all(lectureSessionDetailPromises);

    if (upcoming) {
      const now = new Date();

      responses = responses.filter((r) => new Date(r.start_at) > now);
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
  static async getToken(cohortUrl, username, password) {
    this.BASE_URL = cohortUrl + "/api";
    console.log("BASE_URL", this.BASE_URL);
    const info = { username, password };
    const res = await this.request(`-token`, (data = info), (method = "POST"));

    this.token = res.token;

    return res.token;
  }
  //   /** Get details on all companies that match search*/
  //   static async getCompanies(search) {
  //     let res = await this.request(
  //       `companies`,
  //       search ? { nameLike: search } : {}
  //     );

  //     return res.companies;
  //   }

  //   /** Get details on all jobs that match search*/
  //   static async getJobs(search) {
  //     let res = await this.request(`jobs`, search ? { title: search } : {});

  //     return res.jobs;
  //   }

  //   /**Login and returns token or errors if bad username/password */
  //   static async login(username, password) {
  //     let res = await this.request(`auth/token`, { username, password }, "POST");

  //     return res.token;
  //   }

  //   /**Signup and returns token or errors if bad inputs */

  //   static async signup(username, password, firstName, lastName, email) {
  //     let res = await this.request(
  //       `auth/register`,
  //       { username, password, firstName, lastName, email },
  //       "POST"
  //     );

  //     return res.token;
  //   }

  //   /**Get information on user */
  //   static async getUser(username) {
  //     let res = await this.request(`users/${username}`);

  //     return res.user;
  //   }

  //   /**Patch user info */
  //   static async updateUser(formData) {
  //     const username = formData.username;
  //     delete formData.username;

  //     let res = await this.request(`users/${username}`, { ...formData }, "PATCH");

  //     return res.user;
  //   }

  //   /**Applies to job */
  //   static async applyToJob(username, jobId) {
  //     await this.request(`users/${username}/jobs/${jobId}`, {}, "POST");
  //   }
  // }
}
export default SISApi;
