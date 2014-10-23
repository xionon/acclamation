module.exports = {
  url: process.env.REDISCLOUD_URL || 'http://localhost:6379',
  debug: process.env.REDIS_DEBUG || false,
};
