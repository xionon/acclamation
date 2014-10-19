(function() {
  'use strict';

  var Client = function() {
    var self = this;

    this.temperature = new Temperature(this);
    this.cardWall = new CardWall(this);
    this.addCard = new AddCard(this);
    this.cardForm = new CardForm(this);
    this.sessionId = window.location.pathname.match(/\/client\/([A-Z0-9\-]+)/i)[1];

    this.initialize = function() {
      var next = self.showTemperature;

      if (self.temperature.hasVoted()) {
        next = self.showCardWall;
      }

      $(function() {
        setTimeout(next, 500);
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
      self.cardForm.off();
    };

    this.showCardForm = function() {
      self.addCard.off();
      self.cardForm.on();
    };

    this.hideCardForm = function() {
      self.addCard.on();
      self.cardForm.off();
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
      self.recordVote();
      client.showCardWall();
    };

    this.error = function(err) {
      console.error(err);
      alert('An error occurred.  Refer to the console for more information');
    };

    this.recordVote = function() {
      localStorage.setItem('acclamation.temperature.lastVotingSessionId', client.sessionId);
    };

    this.hasVoted = function() {
      return localStorage.getItem('acclamation.temperature.lastVotingSessionId') == client.sessionId;
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
      this.loadAll().then(this.socketConnect);
    };

    this.off = function() {
    };

    this.loadAll = function() {
      return $.get('/cards')
        .success(self.renderAll)
        .error(self.error);
    };

    this.renderAll = function(data) {
      $.each(data.cards, function(id, card) {
        self.appendCard(card);
      });
    };

    this.socketConnect = function() {
      var socket = io.connect();
      socket.on('card.created', self.appendCard);
      socket.on('card.updated', self.updateCard);
      socket.on('card.folded', self.foldCard);
    };

    this.appendCard = function(card) {
      var $card = $('<div/>');

      if (card.parent) {
        return;
      }

      $card.addClass('card')
        .attr('id', 'card-' + card.id)
        .addClass('card-' + card.topic)
        .html(self.htmlForCard(card))
        .hide();

      $cardWall.append($card);
      $card.fadeIn('fast');
    };

    this.updateCard = function(card) {
      var $card = $('#card-' + card.id);
      $card.html(self.htmlForCard(card));
    };

    this.foldCard = function(card) {
      var $parent = $('#card-' + card.parent);
      var $card = $('#card-' + card.id);

      $card.slideUp('fast', function() {
        $card.remove();
      });
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
      $addCard.find('button').slideDown('fast');
      $('#cardwall').animate({marginTop: '3.5em'}, 'fast');
    };

    this.off = function() {
      $addCard.find('button').slideUp('fast');
      $('#cardwall').css({marginTop: 'inherit'});
    };
  };

  var CardForm = function(client) {
    var self = this;
    var $cardForm;
    var $textarea;

    $(function() {
      $cardForm = $('#cardform');
      $textarea = $cardForm.find('textarea');

      $cardForm.delegate('#cardtopics button', 'click', self.chooseTopic);
      $cardForm.delegate('#cardtopics button.selected', 'click', self.cancelTopic);
      $cardForm.delegate('button.cancel', 'click', function(e) {
        e.preventDefault();
        client.hideCardForm();
      });
      $cardForm.delegate('button.save', 'click', self.persistCard);
    });

    this.on = function() {
      $cardForm.slideDown('fast');
    };

    this.off = function() {
      $cardForm.slideUp('fast', function() {
        self.cancelTopic();
        $cardForm.find('textarea').val('');
      });
    };

    this.chooseTopic = function(e) {
      $cardForm
        .find('#cardtopics button')
        .not(e.currentTarget)
        .stop(true, true)
        .slideUp('fast')
        .fadeOut('fast');
      $textarea
        .slideDown('fast')
        .focus();
      $(e.currentTarget).addClass('selected');
      e.preventDefault();
    };

    this.cancelTopic = function() {
      $cardForm
        .find('#cardtopics button')
        .removeClass('selected')
        .stop(true, true)
        .slideDown('fast')
        .fadeIn('fast');
      $textarea
        .slideUp('fast');
    };

    this.persistCard = function(e) {
      var card = {
        topic: $cardForm.find('#cardtopics button.selected').val(),
        title: $cardForm.find('textarea').val().trim()
      };

      if (card.topic === '' || card.title === '') {
        return false;
      }

      $.post('/cards', {card: card})
        .success(self.done)
        .error(self.error);
      e.preventDefault();
    };

    this.done = function() {
      client.hideCardForm();
    };

    this.error = function(err) {
      console.error(err);
      alert('An error occurred.  Refer to the console for more information');
    };
  };

  Client.prototype.Temperature = Temperature;
  Client.prototype.CardWall = CardWall;

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Client = Client;
})();
