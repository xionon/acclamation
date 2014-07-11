var Temperature = require("./../models/temperature");

module.exports = {
  index: function* (next) {
    var temperature = new Temperature();
    var self = this;

    yield temperature.load();

    this.type = "application/json";
    this.body = temperature.getValues();
  },
  vote: function* () {
    var temperature = new Temperature();

    yield temperature.increment(this.params.key);

    yield temperature.load();
    this.webSockets.emit("temperature", temperature.getValues());

    this.status = 200;
  }
};
