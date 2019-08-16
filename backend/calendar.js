const { google } = require("googleapis");
const path = require("path");
const util = require("util");
class Calendar {
  constructor() {
    this.jwtClient = new google.auth.JWT(
      process.env.SA_CLIENT_EMAIL,
      null,
      process.env.SA_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar"],
      null
    );
    this.calendarId = process.env.CALENDAR_ID;
  }
  async authorize() {
    try {
      const authorize = util.promisify(
        this.jwtClient.authorize.bind(this.jwtClient)
      );
      await authorize();
      console.log("authorization done");
    } catch (error) {
      console.error("received error", error);
      throw error;
    }
  }
  async getEvents() {
    try {
      await this.authorize();
      const calendar = google.calendar({ version: "v3", auth: this.jwtClient });
      const getEventsAsync = util.promisify(
        calendar.events.list.bind(calendar.events)
      );
      const result = await getEventsAsync({
        calendarId: this.calendarId
      });
      return result.data.items;
    } catch (error) {
      console.error("threw error", error);
      throw error;
    }
  }
}
module.exports = { Calendar };
