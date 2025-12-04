import express from "express";
import cors from "cors"
import {
  getPopularMovies,
  getMovieById,
  getMoviesByName,
} from "../controllers/tmdb.controller.js";
import { apiLimiter, corsOptions } from "../middlewares/security.js";

const router = express.Router();

router.get("/popular", cors(corsOptions), apiLimiter, getPopularMovies);
router.get("/movies/:id", getMovieById);
router.get("/search/:name", getMoviesByName)

export default router;
