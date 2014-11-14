(function() {
  'use strict';

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Clock = function(container) {
    var timer;
    var self = this;

    this.container = $(container);

    timer = setInterval(function() {
      var date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes();

      self.container.html(hours + (minutes < 10 ? ':0' : ':') + minutes);
    }, 1000);
  };
})();
