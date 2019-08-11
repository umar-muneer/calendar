const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get("/api/health", (req, res) => {
    res.json("OK");
});
app.get("/api/calendar/events", (req, res) => {
    res.json("OK");
});
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(process.env.PORT || 3000);