var redis = require("./../redis_client");
var wrapper = require("co-redis");

module.exports = function() {
  var values = {"1": 0, "2": 0, "3": 0, "4": 0, "5": 0};
  var self = this;

  this.getValues = function() {
    return values;
  };

  this.load = function* () {
    yield [
      this._loadKey(1),
      this._loadKey(2),
      this._loadKey(3),
      this._loadKey(4),
      this._loadKey(5)
    ];
  };

  this.increment = function* (key) {
    yield wrapper(redis).hincrby("temperature", String(key), 1);
  };

  this._loadKey = function* (key) {
    val = yield wrapper(redis).hget("temperature", String(key));
    values[key] = Number(val) || 0;
  };
};
