import { rateLimit, ipKeyGenerator } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Allow 5 failed login attempts per email
  standardHeaders: true,
  legacyHeaders: false,

  // Render free tier requires trust proxy + custom key
  keyGenerator: (req, res) => {
    // Rate-limit by email if provided, otherwise fallback to IP
    if (req.body?.email && typeof req.body.email === "string") {
      return `auth:${req.body.email.toLowerCase().trim()}`;
    }
    // Fallback to IP for routes without email in body
    return `auth:${ipKeyGenerator(req.ip || "127.0.0.1")}`;
  },

  message: {
    status: 429,
    message: "Too many login attempts. Try again in 10 minutes.",
  },
});
