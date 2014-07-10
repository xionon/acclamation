"use script";

module.exports = {};

var routes = [
  "client",
  "moderator",
  "session",
  "survey"
];

routes.map(function(route) {
  module.exports[route] = require("./routes/" + route);
});
