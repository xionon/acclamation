(function() {
  var Client = function() {
    var self = this;

    this.temperature = new Temperature(this);
    this.cardWall = new CardWall(this);

    this.initialize = function() {
      $(function() {
        setTimeout(self.showTemperature, 500);
      });
    };

    this.showTemperature = function() {
      $("#loader").hide();
      self.temperature.on();
    };

    this.showCardWall = function() {
      $("#loader").hide();
      self.temperature.off();
      self.cardWall.on();
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
      client.showCardWall();
    };

    this.error = function(err) {
      console.error(err);
      alert("An error occurred.  Refer to the console for more information");
    };
  };

  var CardWall = function(client) {
    var self = this;
    var $cardWall;

    $(function() {
      $cardWall = $("#cardwall");
    });

    this.on = function() {
      $cardWall.show();
      this.loadAll();
    };

    this.off = function() {
    };

    this.loadAll = function() {
      $.get("/cards")
        .success(self.renderAll)
        .error(self.error);
    };

    this.renderAll = function(data) {
      $.each(data.cards, function(card) {
        self.appendCard(card);
      });
    };

    this.appendCard = function(card) {
      var $card = $("<div/>");
      $card.addClass("card")
        .addClass("card-" + card.topic)
        .text(card.title)
        .hide();

      $cardWall.append($card);
      $card.fadeIn("fast");
    };

    this.error = function(err) {
      console.error(err);
      alert("An error occurred.  Refer to the console for more information");
    };
  };

  Client.prototype.Temperature = Temperature;
  Client.prototype.CardWall = CardWall;

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Client = Client;
})();
