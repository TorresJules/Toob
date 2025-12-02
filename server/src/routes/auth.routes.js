import express from "express";
import {
  register,
  login,
  getProfile
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route pour créer un compte
router.post("/register", register);

// route login
router.post("/login", login);

// route profile
router.get("/profile", protect, getProfile)
// Note: profile sera protégé plus tard avec un middleware

export default router;