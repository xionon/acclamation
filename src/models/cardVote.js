'use strict';

var redis = require('../redisClient');

module.exports = function() {
  var self = this;

  this.cardId = null;
  this.votes = 0;

  this.load = function(cardId, done) {
    redis.hget('card_votes', cardId, function(err, res) {
      if (err !== null) {
        throw err;
      }

      self.cardId = cardId;
      self.votes = parseInt(res) || 0;

      done(self);
    });
  };

  this.increment = function(cardId, value, done) {
    redis.hincrby('card_votes', cardId, value, function(err, res) {
      if (err !== null) {
        throw err;
      }

      done(self);
    });
  };
};
