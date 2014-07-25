var CardRepository = require("../models/card_repository");
var Session = require("../models/session");

module.exports = {
  index: function* () {
    var session = new Session();

    yield session.load();

    var cardRepository = new CardRepository();
    all = yield cardRepository.all();
    console.log(all);

    if (session.id() === this.params.session_id) {
      yield this.render("client");
    } else {
      console.error("Expecting to find session " + this.params.session_id + " but found session " + session.id());

      this.status = 404;
      this.body = "Session not found";
    }
  }
};
