const Redis = require('ioredis');
const logger = require('../utils/logger');

let redisClient;

if (process.env.REDIS_URL) {
  try {
    // Basic check for protocol to prevent the invalid URL crash
    const urlToUse = process.env.REDIS_URL.startsWith('redis://') || process.env.REDIS_URL.startsWith('rediss://') 
      ? process.env.REDIS_URL 
      : `redis://${process.env.REDIS_URL}`;
      
    redisClient = new Redis(urlToUse, {
      maxRetriesPerRequest: null,
      retryStrategy(times) {
        // Stop retrying after 3 failed attempts
        if (times > 3) {
          return null;
        }
        return Math.min(times * 50, 2000);
      }
    });
    
    redisClient.on('connect', () => logger.info('Redis client connected'));
    redisClient.on('error', (err) => {
      logger.error(`Redis Error: ${err.message}`);
      if (err.message.includes('NOAUTH') || err.message.includes('Authentication required')) {
        logger.error('Redis authentication failed. Stopping reconnect attempts. Please provide a password in REDIS_URL.');
        redisClient.disconnect();
      }
    });
  } catch (error) {
    logger.error(`Failed to initialize Redis client: ${error.message}`);
    redisClient = undefined;
  }
} else {
  logger.warn('REDIS_URL not set. Redis client not initialized.');
}

module.exports = redisClient;
