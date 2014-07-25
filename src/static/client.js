(function() {
  var Client = function() {
    var self = this;

    this.temperature = new Temperature(this);

    this.initialize = function() {
      $(function() {
        setTimeout(self.showTemperature, 500);
      });
    };

    this.showTemperature = function() {
      $("#loader").hide();
      self.temperature.on();
    };

    this.showCardwall = function() {
      $("#loader").hide();
      self.temperature.off();
    };

    this.initialize();
  };

  var Temperature = function(client) {
    var self = this;
    var $temperature;

    $(function() {
      $temperature = $("#temperature");
    });

    this.on = function() {
      $temperature.show();
      $temperature.delegate("button", "click", self.vote);
    };

    this.off = function() {
      $temperature.hide();
    };

    this.vote = function() {
      value = $(this).val();
      $.post("/temperature/vote/" + value)
        .success(self.done)
        .error(self.error);
    };

    this.done = function() {
      client.showCardwall();
    };

    this.error = function(err) {
      console.error(err);
      alert("An error occurred.  Refer to the console for more information");
    };
  };

  Client.prototype.Temperature = Temperature;

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Client = Client;
})();
