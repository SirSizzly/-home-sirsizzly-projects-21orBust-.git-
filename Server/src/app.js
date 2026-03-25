// app.js
const express = require("express");
const app = express();

// core middleware
app.use(express.json());

// routes
const runRoutes = require("./routes/runRoutes");
const roundRoutes = require("./routes/roundRoutes");

// mount routes
app.use("/api/runs", runRoutes);
app.use("/api", roundRoutes);

// optional simple health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
