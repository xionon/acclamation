(function() {
  'use strict';

  var Client = function() {
    var self = this;

    this.temperature = new Temperature(this);
    this.cardWall = new CardWall(this);
    this.addCard = new AddCard(this);
    this.cardForm = new CardForm(this);

    this.initialize = function() {
      $(function() {
        setTimeout(self.showTemperature, 500);
      });
    };

    this.showTemperature = function() {
      $('#loader').hide();
      self.temperature.on();
    };

    this.showCardWall = function() {
      $('#loader').hide();
      self.temperature.off();
      self.cardWall.on();
      self.addCard.on();
    };

    this.showCardForm = function() {
      self.cardForm.on();
    };

    this.initialize();
  };

  var Temperature = function(client) {
    var self = this;
    var $temperature;

    $(function() {
      $temperature = $('#temperature');
    });

    this.on = function() {
      $temperature.show();
      $temperature.delegate('button', 'click', self.vote);
    };

    this.off = function() {
      $temperature.hide();
    };

    this.vote = function() {
      var value = $(this).val();
      $.post('/temperature/vote/' + value)
        .success(self.done)
        .error(self.error);
    };

    this.done = function() {
      client.showCardWall();
    };

    this.error = function(err) {
      console.error(err);
      alert('An error occurred.  Refer to the console for more information');
    };
  };

  var CardWall = function(client) {
    var self = this;
    var $cardWall;

    $(function() {
      $cardWall = $('#cardwall');
    });

    this.on = function() {
      $cardWall.show();
      this.loadAll();
    };

    this.off = function() {
    };

    this.loadAll = function() {
      $.get('/cards')
        .success(self.renderAll)
        .error(self.error);
    };

    this.renderAll = function(data) {
      $.each(data.cards, function(id, card) {
        self.appendCard(card);
      });
    };

    this.appendCard = function(card) {
      var $card = $('<div/>');
      $card.addClass('card')
        .addClass('card-' + card.topic)
        .html(self.htmlForCard(card))
        .hide();

      $cardWall.append($card);
      $card.fadeIn('fast');
    };

    this.error = function(err) {
      console.error(err);
      alert('An error occurred.  Refer to the console for more information');
    };

    this.htmlForCard = function(card) {
      var iconMap = {
        'happy': 'fa-smile-o',
        'sad': 'fa-frown-o',
        'idea': 'fa-lightbulb-o',
        'shoutout': 'fa-bullhorn'
      };

      return [
        '<i class="fa fa-2x ',
        iconMap[card.topic],
        '"></i>',
        card.title
      ].join('');
    };
  };

  var AddCard = function(client) {
    var self = this;
    var $addCard;

    $(function() {
      $addCard = $('#addcard');
      $addCard.delegate('button', 'click', client.showCardForm);
    });

    this.on = function() {
      $addCard.show();
    };

    this.off = function() {
    };
  };

  var CardForm = function(client) {
    var self = this;
    var $cardForm;

    $(function() {
      $cardForm = $('#cardform');
    });

    this.on = function() {
      $cardForm.removeClass('hidden').fadeIn('fast');
    };

    this.off = function() {
    };
  };

  Client.prototype.Temperature = Temperature;
  Client.prototype.CardWall = CardWall;

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Client = Client;
})();
