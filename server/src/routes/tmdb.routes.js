import express from "express";
import cors from "cors"
import {
  getPopularMovies,
  getMovieById,
} from "../controllers/tmdb.controller.js";
import { apiLimiter, corsOptions } from "../middlewares/security.js";

const router = express.Router();

router.get("/popular", cors(corsOptions), apiLimiter, getPopularMovies);
router.get("/movies/:id", getMovieById);

export default router;
