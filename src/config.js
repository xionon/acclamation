"use strict";

module.exports = {};

var configs = [
  "server",
  "redis"
];

configs.map(function(component) {
  module.exports[component] = require("./../config/" + component);
});
