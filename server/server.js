import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tmdbRoutes from "./src/routes/tmdb.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import connectDB from "./src/config/database.js";

dotenv.config();
const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Routes
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
