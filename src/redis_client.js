"use strict";

var redis = require("redis");
var config = require("./config")

redis.debug_mode = config.redis.debug;

var client = redis.createClient(config.redis.port, config.redis.hostname);

client.on("connect", function() {
  console.info("Connected to redis on " + config.redis.hostname + ":" + config.redis.port);
});

module.exports = client;
