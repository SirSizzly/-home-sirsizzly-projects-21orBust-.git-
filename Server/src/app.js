const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  }),
);

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ROUTES
app.use("/api/run", require("./routes/runRoutes"));
app.use("/api/shop", require("./routes/shopRoutes"));

module.exports = app;
