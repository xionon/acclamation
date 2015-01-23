'use strict';

var redis = require('redis');
var config = require('./config');
var url = require('url');

var RedisClientFactory = function() {};

RedisClientFactory.prototype.createClient = function() {
  /* jshint camelcase: false */
  redis.debug_mode = config.redis.debug;
  /* jshint camelcase: true */

  var redisUrl = url.parse(config.redis.url);

  var client = redis.createClient(redisUrl.port, redisUrl.hostname);

  if (redisUrl.auth !== null) {
    client.auth(redisUrl.auth.split(':')[1]);
  }

  client.on('connect', function() {
    console.info('Connected to redis on ' + redisUrl.hostname + ':' + redisUrl.port);
  });

  return client;
};

module.exports = RedisClientFactory;
