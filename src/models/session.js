'use strict';

var config = require('../config');
var qr = require('qr-image');
var redis = require('../redisClient');
var uuid = require('uuid');

module.exports = function() {
  var id = null;
  var self = this;

  this.id = function() {
    return id;
  };

  this.create = function(done) {
    id = uuid.v4();
    redis.set('active_session_id', id, function(err, res) {
      if (err !== null) {
        throw err;
      }

      done(self);
    });
  };

  this.destroy = function () {
    redis.del('active_session_id');
  };

  this.load = function (done) {
    redis.get('active_session_id', function(err, res) {
      if (err !== null) {
        throw err;
      }
      id = res;
      done(self);
    });
  };

  this.qr = function() {
    return qr.image(config.server.baseUrl + '/client/' + this.id(), { type: 'png', size: 8 });
  };
};
