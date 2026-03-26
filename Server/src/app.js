const express = require("express");
const app = express();

app.use(express.json());

const runRoutes = require("./routes/runRoutes");
const roundRoutes = require("./routes/roundRoutes");
const runProgressionRoutes = require("./routes/runProgressionRoutes");
const runStateRoutes = require("./routes/runStateRoutes");
const shopRoutes = require("./routes/shopRoutes");

app.use("/api/runs", runRoutes);
app.use("/api", roundRoutes);
app.use("/api", runProgressionRoutes);
app.use("/api", runStateRoutes);
app.use("/api", shopRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
