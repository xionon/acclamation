"use strict";

module.exports = {
  hostname: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || "6379",
  debug: process.env.REDIS_DEBUG || true,
};
