'use strict';

var Clock = function(container) {
  var self = this;
  var timer;

  this.container = $(container);

  timer = setInterval(function() {
    var date = new Date(),
      hours = date.getHours(),
      minutes = date.getMinutes();

    self.container.html(hours + (minutes < 10 ? ':0' : ':') + minutes);
  }, 1000);
};

module.exports = Clock;
