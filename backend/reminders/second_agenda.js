const ReminderModule = require("./index");
const moment = require("moment");
const bunyan = require("bunyan");
const logger = bunyan.createLogger({ name: "reminders" });

const register1 = async () => {
  const agenda = ReminderModule.createNew("agenda1");
  logger.info("registering job a");
  agenda.define("job-a", { concurrency: 1 }, (job, done) => {
    logger.info(`job started: ${job.attrs.name} at ${moment().format()}`);
    setTimeout(() => {
      logger.info("job finished:", job.attrs.name, ", at: ", moment().format());
      done();
    }, 10000);
  });
  const job = agenda.create("job-a");
  await agenda.start();
  job.repeatEvery("5 seconds");
  job.save();
};

const graceFulShutdown = async agenda => {
  logger.info("shutting down");
  await agenda.stop();
  process.exit(0);
};
const handler = async (fn = () => {}, done) => {
  try {
    await fn();
    done();
  } catch (error) {
    done(error);
  }
};
const resumeUnfinishedScheduledJobs = async agenda => {
  logger.info("only retrieving jobs that were started but not finished");
  const jobs = await agenda.jobs({
    lastFinishedAt: null,
    lastRunAt: { $ne: null },
    type: "normal"
  });
  if (jobs.length === 0) {
    logger.info("no resumable jobs found");
    return;
  }
  logger.info(`resuming ${jobs.length} jobs`);
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    job.attrs.nextRunAt = moment()
      .add(5, "seconds")
      .toDate();
    await job.save();
  }
};
const unlockRepeatingJobsAfterGracelessShutdown = async agenda => {
  logger.info("retrieving repeating jobs to unlock");
  // we need to retrieve only those jobs that are still running and locked.
  const jobs = await agenda.jobs({
    lockedAt: { $ne: null },
    repeatInterval: { $exists: true }
  });
  for (let i = 0;i < jobs.length; i += 1) {
    const job = jobs[i];
    job.attrs.nextRunAt = moment().add(5, "seconds").toDate();
    job.attrs.lockedAt = null;
    await job.save();
  }
};
const register2 = async () => {
  const agenda = ReminderModule.createNew("agenda2");

  process.on("SIGTERM", graceFulShutdown.bind(null, agenda));
  process.on("SIGINT", graceFulShutdown.bind(null, agenda));

  agenda.define("job-b", {concurrency: 1}, (job, done) => {
    logger.info(`job-b triggered at ${moment().format()}`);
    setTimeout(() => {
      logger.info(`job-b finished at ${moment().format()}`);
      done();
    }, 15000);
  });
  agenda.define("job-c", (job, done) => {
    logger.info(`job-c triggered at ${moment().format()}`);
    logger.info("data is:", job.attrs.data);
    setTimeout(() => {
      logger.info(`job-c finished at ${moment().format()}`);
      done();
    }, 15000);
  });
  await agenda.start();
  await resumeUnfinishedScheduledJobs(agenda);
  await unlockRepeatingJobsAfterGracelessShutdown(agenda);
  return agenda;
};

const schedule2 = async agenda => {
  await agenda.start();
  logger.info("scheduling jobs");
  await agenda.schedule(
    moment()
      .add(10, "seconds")
      .toDate(),
    "job-c",
    { params: "umarmuneer@gmail.com" }
  );
  await agenda.schedule(
    moment()
      .add(20, "seconds")
      .toDate(),
    "job-c",
    { params: "umarmuneer@outlook.com" }
  );
  await agenda.every("10 seconds", "job-b");
};

(async () => {
  //   await register1();
  const agenda2 = await register2();
  await schedule2(agenda2);
})();
