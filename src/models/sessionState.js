'use strict';

var redis = require('../redisClient');

module.exports = function(options) {
  var self = this;

  options = options || {};
  this.allowNewCards = options.allowNewCards || true;
  this.allowVoting = options.allowVoting || false;

  this.save = function(done) {
    redis.set('session_state', this.toJson(), function(err, res) {
      if (err !== null) {
        throw err;
      }

      done(self);
    });
  };

  this.load = function (done) {
    redis.get('session_state', function(err, res) {
      if (err !== null) {
        throw err;
      }
      self.fromJson(res);
      done(self);
    });
  };

  this.fromJson = function(json) {
    var object = JSON.parse(json);

    for (var key in object) {
      if (object.hasOwnProperty(key) && self.hasOwnProperty(key)) {
        self[key] = object[key];
      }
    }

    return self;
  };

  this.toPlainObject = function() {
    return self.normalizeBooleans({
      allowNewCards: this.allowNewCards,
      allowVoting: this.allowVoting,
    });
  };

  this.toJson = function() {
    return JSON.stringify(this.toPlainObject());
  };

  this.normalizeBooleans = function(object) {
    for (var key in object) {
      if (object.hasOwnProperty(key) && object[key] !== Boolean(object[key])) {
        switch (object[key]) {
          case 'false': object[key] = false; break;
          case 'true': object[key] = true; break;
        }
      }
    }

    return object;
  };
};
