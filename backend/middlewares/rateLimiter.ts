import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Allow 5 failed login attempts per email
  standardHeaders: true,
  legacyHeaders: false,

  // Render free tier requires trust proxy + custom key
  keyGenerator: (req) => {
    // Rate-limit by email if provided, otherwise fallback to IP
    // This ensures each user/email gets their own rate limit, not shared by IP
    if (req.body?.email && typeof req.body.email === "string") {
      return `auth:${req.body.email.toLowerCase().trim()}`;
    }
    // Fallback to IP for routes without email in body
    return `auth:${req.ip || req.socket.remoteAddress || "unknown"}`;
  },

  message: {
    status: 429,
    message: "Too many login attempts. Try again in 10 minutes.",
  },
});
