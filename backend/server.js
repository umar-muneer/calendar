const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const expressBunyan = require("express-bunyan-logger");

dotenv.config({ path: path.join(__dirname, ".env") });
const { Calendar } = require("./calendar");

const app = express();

app.use(express.json());
// app.use(expressBunyan());
app.use(expressBunyan.errorLogger());
app.use(express.static(path.join(__dirname, "../dist")));

app.get("/api/health", (req, res) => {
  res.json("OK");
});
app.get("/api/calendar/events", async (req, res) => {
  const calendar = new Calendar();
  try {
    const result = await calendar.getEvents();
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});
app.post("/api/calendar", (req, res) => {
  const calendar = new Calendar();
  calendar.createCalendar();
});
app.post("/api/calendar/events", async (req, res) => {
  try {
    const { startDate, endDate, title, calendarId, email } = req.body;
    if (!startDate || !endDate || !title || !calendarId || !email) {
      res.status(400).end();
      return;
    }
    const calendar = new Calendar();
    const result = await calendar.createRateLimitedEvent({
      startDate,
      endDate,
      title,
      calendarId,
      email
    });
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});
app.get("/api/bootstrap", (req, res) => {
  res.json("OK");
});
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../", "dist", "index.html"));
});
const port = process.env.PORT || 3000;
app
  .listen(port, () => console.log(`server listening at port: ${port}`))
  .setTimeout(15 * 60000);
