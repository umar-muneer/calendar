const { google } = require("googleapis");
const path = require("path");
const util = require("util");
const Bottleneck = require("bottleneck");
const { EventReminder } = require("./reminders/event");
const iterator = require("./date-iterator");
const createEventsRateLimiter = new Bottleneck({
  minTime: 333,
  maxConcurrent: 5
});
createEventsRateLimiter.on("debug", (message, data) => {
  // console.log(message);
  // console.log(data);
});
createEventsRateLimiter.on("failed", async (error, jobInfo) => {
  const id = jobInfo.options.id;
  console.warn(`Job ${id} failed: ${error}`);
});

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
  async createCalendar() {
    const testjwt = new google.auth.JWT(
      process.env.SA_CLIENT_EMAIL,
      null,
      process.env.SA_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar"],
      "umarmuneer@gmail.com"
    );
    const calender = google.calendar({ version: "v3", auth: testjwt });
    console.log("trying to create calendar");
    calender.calendars.insert({
      summary: "test-calendar-3"
    });
  }
  async createRateLimitedEvent({
    startDate,
    endDate,
    title,
    calendarId,
    email
  }) {
    const next = iterator.next();
    return createEventsRateLimiter.schedule(() =>
      this.createEvent({
        startDate: next.startDate,
        endDate: next.endDate,
        title,
        calendarId,
        email
      })
    );
  }
  async createEvent({ startDate, endDate, title, calendarId, email }) {
    /**
     * In the actual implemention, the reminders will only be created after the following two steps are accomplished
     * 1. insert in our local database
     * 2. create an entry in google calendar
     * 1 and 2 will be executed inside a db transaction
     * 3. once 1 and 2 are both successful, only then the reminders will be created. this will prohibit creation of dangling reminders
     */
    try {
      const testjwt = new google.auth.JWT(
        process.env.SA_CLIENT_EMAIL,
        null,
        process.env.SA_PRIVATE_KEY.replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/calendar"],
        // "umar.muneer1@pakistanpropertyshow.com",
        email
      );

      const calendar = google.calendar({ version: "v3", auth: testjwt });
      const { data } = await calendar.events.insert({
        calendarId,
        resource: {
          summary: title,
          start: {
            dateTime: startDate,
            timeZone: "Asia/Karachi"
          },
          end: {
            dateTime: endDate,
            timeZone: "Asia/Karachi"
          }
        }
      });
      // const reminder = new EventReminder(
      //   data.id,
      //   data.summary,
      //   data.start.dateTime,
      //   data.end.dateTime
      // );
      // await reminder.register();
      return data;
    } catch (error) {
      console.error("threw error: ", error);
      throw error;
    }
  }
}
module.exports = { Calendar };
