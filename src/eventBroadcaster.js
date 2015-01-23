'use strict';

var RedisClientFactory = require('./redisClientFactory');

var EventBroadcaster = function(app) {
  this.app = app;
  this.redis = (new RedisClientFactory()).createClient();
};

EventBroadcaster.prototype.start = function() {
  this.redis.on('message', function(channel, message) {
    var event, data;
    return if (channel !== 'acclamation.events');
    console.log('Got event message', message);
  });
  this.redis.subscribe('acclamation.events');
};

module.exports = EventBroadcaster;
