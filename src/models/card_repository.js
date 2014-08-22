'use strict';

var redis = require('../redis_client');

module.exports = function() {
  var self = this;

  this.all = function(done) {
    redis.hgetall('cards', function(err, res) {
      if (err !== null) {
        throw err;
      }

      done(self);
    });
  };
};
