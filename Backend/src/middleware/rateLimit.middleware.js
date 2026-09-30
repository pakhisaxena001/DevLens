import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts',
  skipSuccessfulRequests: true,
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many API requests',
});
