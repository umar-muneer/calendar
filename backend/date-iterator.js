const moment = require("moment");

let startDate = moment().startOf("day").add(14, "days");
let endDate = startDate.clone().add("5", "minutes");

const reset = () => {
  startDate = moment()
    .startOf("day")
    .toDate();
  endDate = moment()
    .add("5", "minutes")
    .toDate();
};

const next = () => {
  startDate = startDate
    .clone()
    .add(5, "minutes")
  endDate = endDate
    .clone()
    .add(5, "minutes")
  return {
    startDate: startDate.toDate(),
    endDate: endDate.toDate()
  };
};

module.exports = { next, reset };
