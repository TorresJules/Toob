import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import tmdbRoutes from "./src/routes/tmdb.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import connectDB from "./src/config/database.js";
import userMovieRoutes from "./src/routes/userMovie.routes.js";

dotenv.config();
const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

// Routes
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user-movies", userMovieRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
