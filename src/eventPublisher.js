'use strict';

var redis = require('./redisClient');

var EventPublisher = function(topic) {
  this.topic = topic;
};

EventPublisher.prototype.publish = function(event, data) {
  var message = JSON.stringify({
    event: event,
    data: data
  });

  console.log('Publishing event', event, data);
  redis.publish(this.topic, message);
};

module.exports = EventPublisher;
