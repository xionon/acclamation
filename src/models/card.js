var redis = require("../redis_client");
var uuid = require("uuid");
var wrapper = require("co-redis");

module.exports = function(options) {
  var self = this;

  options = options || {};

  this.id = null;
  this.type = options.type || "card";
  this.topic = options.topic;
  this.title = options.title;
  this.votes = 0;

  this.load = function* (id) {
    val = yield wrapper(redis).hget("cards", id);
    this.fromJson(val);
  };

  this.save = function* () {
    if (this.id === null) {
      this.id = uuid.v4();
    }

    yield wrapper(redis).hset("cards", this.id, this.toJson());
  };

  this.fromJson = function(json) {
    object = JSON.parse(json);

    for (key in object) {
      if (object.hasOwnProperty(key) && this.hasOwnProperty(key)) {
        this[key] = object[key];
      }
    }
  };

  this.toPlainObject = function() {
    return {
      id: this.id,
      type: this.type,
      topic: this.topic,
      title: this.title,
      votes: this.votes
    };
  };

  this.toJson = function() {
    return JSON.stringify(this.toPlainObject());
  };
};
