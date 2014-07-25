var redis = require("../redis_client");
var wrapper = require("co-redis");

module.exports = function() {
  this.all = function* () {
    yield wrapper(redis).hgetall("cards");
  };
};
