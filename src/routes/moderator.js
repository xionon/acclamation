var Session = require("../models/session");

module.exports = {
  index: function* () {
    var session = new Session();

    yield session.load();

    if (session.id() === null) {
      yield this.render("session-start");
    } else {
      yield this.render("moderator");
    }
  }
};
