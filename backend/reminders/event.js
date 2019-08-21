const { agenda } = require("./index");
const moment = require("moment-timezone");

class EventReminder {
  constructor(eventId, eventName, startDate, endDate) {
    this.agenda = agenda;
    this.startDate = startDate;
    this.endDate = endDate;
    this.eventId = eventId;
    this.eventName = eventName;
    this.namePrefix = "event-reminder";
  }
  createAgendaName(suffix = "") {
    return `${this.namePrefix}-${this.eventId}-${suffix}`;
  }
  run(job, done) {
    if (moment(job.attrs.data.executionTime).unix() < moment().unix()) {
      console.log("ignoring job as it was supposed to run in the past");
    } else {
      console.log(`executing ${job.attrs.name}`);
      console.log("sending email notification");
      console.log("sending push notifications");
    }
    done();
  }
  get thirtyMinutesBefore() {
    return {
      name: this.createAgendaName("30-minutes-before"),
      executionTime: moment(this.startDate)
        .subtract(30, "minutes")
        .toDate()
    };
  }
  get sixtyMinutesBefore() {
    return {
      name: this.createAgendaName("60-minutes-before"),
      executionTime: moment(this.startDate)
        .subtract(60, "minutes")
        .toDate()
    };
  }
  get thirtyMinutesAfter() {
    return {
      name: this.createAgendaName("30-minutes-after"),
      executionTime: moment(this.endDate)
        .add(30, "minutes")
        .toDate()
    };
  }
  async onComplete(job) {
    /**
     * should we do this and maintain the finished logs?
     */
    // await this.agenda.cancel({ name: job.attrs.name });
    console.log(`${job.attrs.name} cancelled and removed from db`);
  }
  async register() {
    this.agenda.define(this.thirtyMinutesBefore.name, this.run);
    this.agenda.define(this.sixtyMinutesBefore.name, this.run);
    this.agenda.define(this.thirtyMinutesAfter.name, this.run);
    this.agenda.define("", (job) => {
      job.attrs.da
    })
    this.agenda.on("complete", this.onComplete.bind(this));
    await this.agenda.start();
    await this.agenda.schedule(
      this.thirtyMinutesBefore.executionTime,
      this.thirtyMinutesBefore.name,
      {
        executionTime: this.thirtyMinutesBefore.executionTime
      }
    );
    await this.agenda.schedule(
      this.sixtyMinutesBefore.executionTime,
      this.sixtyMinutesBefore.name,
      {
        executionTime: this.sixtyMinutesBefore.executionTime
      }
    );
    await this.agenda.schedule(
      this.thirtyMinutesAfter.executionTime,
      this.thirtyMinutesAfter.name,
      {
        executionTime: this.thirtyMinutesAfter.executionTime
      }
    );
  }
}

module.exports = { EventReminder };
