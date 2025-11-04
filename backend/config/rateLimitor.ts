import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5, // Only 5 failed logins allowed
  message: {
    status: 429,
    message: "Too many login attempts, try again later.",
  },
});
