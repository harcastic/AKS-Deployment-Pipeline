const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const redisClient = require('../config/redis');

// Create a generic store if Redis is available, otherwise use memory store
const createStore = () => {
  if (redisClient) {
    return new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    });
  }
  // Return undefined to use default MemoryStore
  return undefined; 
};

// Global limiter
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  requestPropertyName: 'globalRateLimit', // Fix ERR_ERL_DOUBLE_COUNT
  store: createStore(),
  message: { status: 'error', message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Auth limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
  message: { status: 'error', message: 'Too many login attempts from this IP, please try again after an hour' }
});

// Upload limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 uploads per `window`
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
  message: { status: 'error', message: 'Too many upload attempts from this IP, please try again after an hour' }
});

module.exports = {
  globalRateLimiter,
  authLimiter,
  uploadLimiter
};
