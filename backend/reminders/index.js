const Agenda = require("agenda");
const { EventReminder } = require("./event");

const mongoConnectionString = "mongodb://127.0.0.1/agenda";
const agenda = new Agenda({ db: { address: mongoConnectionString } });

module.exports = {
  Singleton: () => agenda,
  createNew: (collection) => new Agenda({ db: { address: mongoConnectionString, collection } })
};
