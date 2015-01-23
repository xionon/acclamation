'use strict';

var RedisClientFactory = require('./redisClientFactory');
var redisClient = (new RedisClientFactory()).createClient();

module.exports = redisClient;
