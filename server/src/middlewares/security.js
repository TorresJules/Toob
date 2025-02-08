import rateLimit from "express-rate-limit";
import cors from "cors";

// Configuration du rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Configuration CORS
export const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware CORS configuré
export const corsMiddleware = cors(corsOptions);
