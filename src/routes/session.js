var Session = require("./../models/session");

module.exports = {
  qr: function* () {
    var session = new Session;
    var self = this;

    session.load(
      function(session) {
        var qr_code = session.qr();

        self.type = 'image/png';
        self.body = qr_code;
      },
      function(error) {
        console.error("No active session found");
        self.status = 404;
      }
    );
  }
};
