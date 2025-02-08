import express from "express";
import cors from "cors"
import { getPopularMovies } from "../controllers/tmdb.controller.js";
import { apiLimiter, corsOptions } from "../middlewares/security.js";

const router = express.Router();

router.get("/popular", cors(corsOptions), apiLimiter, getPopularMovies);

export default router;
