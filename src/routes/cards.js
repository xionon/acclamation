var CardRepository = require("../models/card_repository");

module.exports = {
  index: function* () {
    var cardRepository = new CardRepository();
    var all = [];

    console.log(all)
    console.log(typeof all)

    console.log("CardRepository.all()")

    all = yield cardRepository.all();

    console.log(all);
    console.log(typeof all);

    this.body = all.map(function(card) {
      return card.toPlainObject();
    });
  }
};
