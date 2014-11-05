'use strict';

var async = require('async');
var Card = require('./card');
var redis = require('../redis_client');

module.exports = function() {
  var self = this;
  var cards = [];

  this.all = function(done) {
    redis.hgetall('cards', function(err, res) {
      if (err !== null) {
        throw err;
      }

      for (var key in res) {
        if (res.hasOwnProperty(key)) {
          cards.push((new Card()).fromJson(res[key]));
        }
      }

      async.map(cards, function(card, callback) {
        card.loadVotes(callback);
      }, function() {
        done(cards, self);
      });
    });
  };
};
