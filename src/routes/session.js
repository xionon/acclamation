var Session = require("./../models/session");

module.exports = {
  qr: function* () {
    var session = new Session;

    yield session.load();

    if (session.id() === null) {
      console.error("No active session found");
      this.status = 404;
    } else {
      this.type = "image/png";
      this.body = session.qr();
    }
  }
};
