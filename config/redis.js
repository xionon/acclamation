module.exports = {
  url: process.env.REDISCLOUND_URL || 'http://localhost:6379',
  debug: process.env.REDIS_DEBUG || false,
};
