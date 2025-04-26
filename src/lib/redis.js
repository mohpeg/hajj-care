const redis = require('redis');
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
})();
module.exports = {redisClient};