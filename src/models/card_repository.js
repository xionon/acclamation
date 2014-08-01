var co = require("co");
var redis = require("../redis_client");
var wrapper = require("co-redis");

module.exports = function() {
  this.all = function* () {
    co(function* () {
      yield wrapper(redis).hgetall("cards")
    });
  };
};
