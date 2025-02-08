import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tmdbRoutes from "./src/routes/tmdb.routes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET"],
  })
);

// Routes
app.use("/api/tmdb", tmdbRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
