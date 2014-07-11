"use script";

module.exports = {};

var routes = [
  "client",
  "moderator",
  "session",
  "temperature"
];

routes.map(function(route) {
  module.exports[route] = require("./routes/" + route);
});
