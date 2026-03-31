// Server/src/server.js
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// STATIC FILES (IMPORTANT)
app.use(express.static(path.join(__dirname, "../public")));

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  }),
);

// ROUTES
const runRoutes = require("./routes/runRoutes");
const shopRoutes = require("./routes/shopRoutes");
const deckRoutes = require("./routes/deckRoutes");
const roundRoutes = require("./routes/roundRoutes");
const runstateRoutes = require("./routes/runstateRoutes");
const runprogressionRoutes = require("./routes/runprogressionRoutes");

app.use("/api/run", runRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/deck", deckRoutes);
app.use("/api/round", roundRoutes);
app.use("/api/runstate", runstateRoutes);
app.use("/api/runprogression", runprogressionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
