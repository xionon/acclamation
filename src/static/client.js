(function() {
  'use strict';

  var Client = function() {
    var self = this;

    this.temperature = new Temperature(this);
    this.cardWall = new CardWall(this);
    this.addCard = new AddCard(this);
    this.cardForm = new CardForm(this);
    this.voting = new Voting(this);
    this.sessionManager = new SessionManager(this);
    this.sessionId = window.location.pathname.match(/\/client\/([A-Z0-9\-]+)/i)[1];

    this.initialize = function() {
      var next = self.showTemperature;

      if (self.temperature.hasVoted()) {
        next = self.initSession;
      }

      $(function() {
        setTimeout(next, 500);
      });
    };

    this.showTemperature = function() {
      $('#loader').hide();
      self.temperature.on();
      self.addCard.off();
      self.cardWall.off();
      self.cardForm.off();
      self.voting.off();
    };

    this.initSession = function() {
      self.sessionManager.on();
    };

    this.showCardWall = function() {
      $('#loader').hide();
      self.temperature.off();
      self.cardWall.on();

      if (self.sessionManager.allowVoting && !self.sessionManager.allowNewCards) {
        self.voting.on();
        self.addCard.off();
        self.cardForm.off();
      } else {
        self.addCard.on();
        self.voting.off();
      }
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
      client.initSession();
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
      self.loadAll().then(this.socketConnect);
    });

    this.on = function() {
      $cardWall.show();
    };

    this.off = function() {
      $cardWall.hide();
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
        .data('card-id', card.id)
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
        card.title,
        '<span class="vote-badge"/>'
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
      $addCard.slideDown('fast');
    };

    this.off = function() {
      $addCard.slideUp('fast');
    };

    this.sessionStateChanged = function(state) {
      if (state.allowNewCards) {
        $addCard
          .find('button')
          .attr('disabled', false)
          .removeClass('pure-button-disabled')
          .text('+ New Card');
      } else {
        $addCard
          .find('button')
          .attr('disabled', true)
          .addClass('pure-button-disabled')
          .text('Closed to New Cards');
      }
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

  var Voting = function(client) {
    var self = this;
    var $voteHeader;
    var $voteStatus;
    var MAX_VOTES = 3;
    var voteMap = {};

    this.clickTimer = null;

    $(function() {
      $voteHeader = $('#voteheader');
      $voteStatus = $('#votestatus');
    });

    this.on = function() {
      self.updateStatus();
      $voteHeader.slideDown('fast');
      self.bindEvents();
    };

    this.off = function() {
      $voteHeader.slideUp('fast');
      self.unbindEvents();
    };

    this.bindEvents = function() {
      self.unbindEvents();
      $('#cardwall').delegate('.card', 'tap', self.vote);
      $('#cardwall').delegate('.card', 'doubletap', self.unvote);
    };

    this.unbindEvents = function() {
      $('#cardwall').undelegate('.card', 'tap');
      $('#cardwall').undelegate('.card', 'doubletap');
    };

    this.vote = function(e) {
      var $card = $(this);

      self.clickTimer = setTimeout(function() {
        if (self.clickTimer === null) {
          return;
        }

        console.log('Received vote for', $card);
        if (self.votesCast() >= MAX_VOTES) {
          alert('You have already used all ' + MAX_VOTES + ' of your votes');
          return;
        }

        self.saveVote($card, 1);
      }, 250);
    };

    this.unvote = function(e) {
      var $card = $(this);
      var cardId = $card.data('card-id');
      clearTimeout(self.clickTimer);
      self.clickTimer = null;

      if (voteMap[cardId] === undefined || voteMap[cardId] > 0) {
        console.log('Received unvote for', $card);
        self.saveVote($card, -1);
      }
    };

    this.saveVote = function($card, value) {
      var cardId = $card.data('card-id');
      $.post('/cards/' + cardId + '/vote', {value: value}).success(function() {
        self.updateVoteMap($card, value);
      });;
    };

    this.updateVoteMap = function($card, value) {
      var cardId = $card.data('card-id');

      voteMap[cardId] = voteMap[cardId] || 0;
      voteMap[cardId] += value;

      if (voteMap[cardId] > 0) {
        $card.find('.vote-badge').text('+' + voteMap[cardId]);
      } else {
        $card.find('.vote-badge').text('');
      }

      self.updateStatus();
    };

    this.updateStatus = function() {
      $voteStatus.text((MAX_VOTES - self.votesCast()) + ' votes left');
    };

    this.votesCast = function() {
      var votesCast = 0;
      $.each(voteMap, function(cardId, votes) {
        votesCast += votes;
      });
      return votesCast;
    };

    this.sessionStateChanged = function(state) {
      client.showCardWall();
    };
  };

  var SessionManager = function(client) {
    var self = this;

    this.allowNewCards = false;
    this.allowVoting = false;

    this.on = function() {
      self.load().then(this.socketConnect);
    };

    this.load = function() {
      return $.get('/session/state').then(self.sessionStateChanged);
    };

    this.socketConnect = function() {
      var socket = io.connect();
      socket.on('sessionState.changed', self.sessionStateChanged);
    };

    this.sessionStateChanged = function(state) {
      self.allowNewCards = state.allowNewCards;
      self.allowVoting = state.allowVoting;

      client.addCard.sessionStateChanged(state);
      client.voting.sessionStateChanged(state);
    };
  };

  Client.prototype.Temperature = Temperature;
  Client.prototype.CardWall = CardWall;

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Client = Client;
})();
