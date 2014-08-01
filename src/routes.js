"use script";

module.exports = {};

var routes = [
  "cards",
  "client",
  "moderator",
  "session",
  "temperature"
];

routes.map(function(route) {
  module.exports[route] = require("./routes/" + route);
});
