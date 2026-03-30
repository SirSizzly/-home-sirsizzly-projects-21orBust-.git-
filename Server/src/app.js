// src/app.js
const express = require("express");
const app = express();

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------
app.use(express.json());

// ------------------------------------------------------------
// Modifier registry (MUST load before routes)
// ------------------------------------------------------------
require("./services/modifierRegistry");

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------
const runRoutes = require("./routes/runRoutes");
const runstateRoutes = require("./routes/runstateRoutes");
const roundRoutes = require("./routes/roundRoutes");
const shopRoutes = require("./routes/shopRoutes");

app.use("/api/runs", runRoutes);
app.use("/api", runstateRoutes);
app.use("/api", roundRoutes);
app.use("/api", shopRoutes);

// ------------------------------------------------------------
// Health check
// ------------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

module.exports = app;
