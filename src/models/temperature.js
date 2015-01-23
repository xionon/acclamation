'use strict';

var redis = require('../redisClient');

module.exports = function() {
  var values = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0};
  var self = this;

  this.getValues = function() {
    return values;
  };

  this.load = function(done) {
    redis.hgetall('temperature', function(err, res) {
      if (err !== null) {
        throw err;
      }

      for (var key in res) {
        if (values.hasOwnProperty(key)) {
          values[key] = Number(res[key]);
        }
      }

      done(self);
    });
  };

  this.increment = function(key, done) {
    redis.hincrby('temperature', String(key), 1, function(err, res) {
      if (err !== null) {
        throw err;
      }

      done(self);
    });
  };
};
