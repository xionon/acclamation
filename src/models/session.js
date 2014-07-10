var uuid = require("uuid");
var qr = require("qr-image");
var redis = require("./../redis_client");

module.exports = function() {
  var id = null;
  var self = this;

  this.id = function() {
    return id;
  };

  this.create = function() {
    id = uuid.v4();
    return this;
  };

  this.load = function(onload, onerror) {
    redis.get("active_session_id", function(err, val) {
      id = val;

      if (id !== null && typeof onload === 'function') {
        onload.call(this, self);
      } else if (id === null && typeof onerror === 'function') {
        onerror.call(this, err);
      }
    });

    return this;
  };

  this.qr = function() {
    return qr.image("http://localhost:8080/client/" + this.id(), { type: "png" });
  };
};
