(function() {
  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Clock = function(container) {
    var timer;
    var self = this;

    this.container = null;

    if (typeof container === "string") {
      this.container = document.getElementById(container.replace(/^#/, ''));
    } else if (typeof container === "object") {
      this.container = container;
    } else {
      throw "Invalid container for clock";
    }

    timer = setInterval(function() {
      var date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes();

      self.container.innerHTML = hours + (minutes < 10 ? ":0" : ":") + minutes;
    }, 1000);
  };
})();
