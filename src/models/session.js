var config = require("./../config");
var qr = require("qr-image");
var redis = require("./../redis_client");
var uuid = require("uuid");
var wrapper = require("co-redis");

module.exports = function() {
  var id = null;
  var self = this;

  this.id = function() {
    return id;
  };

  this.create = function* () {
    id = uuid.v4();
    yield wrapper(redis).set("active_session_id", id);
  };

  this.destroy = function* () {
    yield wrapper(redis).del("active_session_id");
  };

  this.load = function* () {
    id = yield wrapper(redis).get("active_session_id");
  };

  this.qr = function() {
    return qr.image(config.server.base_url + "/client/" + this.id(), { type: "png" });
  };
};
