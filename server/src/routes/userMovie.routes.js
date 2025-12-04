import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  getFavoritesWithDetails,
  addToWatched,
  removeFromWatched,
  getWatched,
  getWatchedWithDetails,
} from "../controllers/userMovie.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Toutes ces routes sont protégées (nécessitent un token)
router.use(protect); // ← Applique protect à TOUTES les routes ci-dessous

// Routes favoris
router.get("/favorites", getFavorites);
router.post("/favorites", addToFavorites);
router.delete("/favorites", removeFromFavorites);

// Routes watched (déjà vus)
router.get("/watched", getWatched);
router.post("/watched", addToWatched);
router.delete("/watched", removeFromWatched);

// Routes avec détails complets
router.get("/favorites/details", getFavoritesWithDetails);
router.get("/watched/details", getWatchedWithDetails);

export default router;
