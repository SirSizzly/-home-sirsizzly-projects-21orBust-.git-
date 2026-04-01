// Server/src/app.js
import express from "express";
import cors from "cors";
import path from "path";

const __dirname = path.resolve();
const app = express();

app.use(cors());
app.use(express.json());

// STATIC: card images
app.use("/deck", express.static(path.join(__dirname, "public/deck/deck")));

// ROUTES
import runRouter from "./routes/runRoutes.js";
app.use("/api/run", runRouter);

import shopRouter from "./routes/shopRoutes.js";
app.use("/api", shopRouter);

export default app;
