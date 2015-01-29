'use strict';

var Clock = function(moderator) {
  var $clock, timer;

  $(function() {
    $clock = $('#clock');
  });

  timer = setInterval(function() {
    var date = new Date(),
      hours = date.getHours(),
      minutes = date.getMinutes();

    $clock.html(hours + (minutes < 10 ? ':0' : ':') + minutes);
  }, 1000);
};

module.exports = Clock;
