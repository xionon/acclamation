'use strict';

var CardWall = function(moderator) {
  var self = this;

  this.voting = false;

  this.initialize = function() {
    self.load().then(self.renderAll).then(self.socketBind);
    $(self.setupEvents);
  };

  this.socketBind = function() {
    moderator.socket.on('card.created', self.appendCard);
    moderator.socket.on('card.updated', self.updateCard);
    moderator.socket.on('card.folded', self.foldCard);
    moderator.socket.on('card.vote', self.updateCard);
    moderator.socket.on('sessionState.changed', self.setState);
  };

  this.load = function() {
    $.get('/session/' + moderator.sessionId + '/state').then(self.setState);
    return $.get('/cards');
  };

  this.renderAll = function(data) {
    $.each(data.cards, function(id, card) {
      self.appendCard(card);
    });
    self.sortCards();
  };

  this.appendCard = function(card) {
    var $card = $('<div/>');
    var $column = $('#cards-' + card.topic);

    if (card.parent) {
      return;
    }

    $card.addClass('card')
      .addClass('card-' + card.topic)
      .attr('id', 'card-' + card.id)
      .data('card-id', card.id)
      .data('card-topic', card.topic)
      .html(self.htmlForCard(card))
      .hide()
      .draggable({containment: '#moderator', cursor: 'move', revert: 'invalid', stack: '.card'})
      .droppable({accept: '.card', hoverClass: 'drop-hover', drop: self.handleCardDrop});

    $column.prepend($card);
    $card.slideDown('fast').fadeIn('fast');
  };

  this.handleCardDrop = function(e, ui) {
    var $primary = $(e.target);
    var $secondary = $(ui.draggable[0]);

    $.post('/cards/' + $secondary.data('card-id') + '/fold', {parent: $primary.data('card-id')});
  };

  this.foldCard = function(card) {
    var $card = $('#card-' + card.id);

    $card.remove();
  };

  this.setupEvents = function() {
    $('.card-column').delegate('.card', 'dblclick', self.editCard);
    $('.card-column').delegate('textarea', 'blur', self.handleCardEdit);
  };

  this.editCard = function(e) {
    var $card = $(e.target);
    var $input;

    if ($card.find('textarea').length > 0) {
      return;
    }

    $input = $('<textarea/>')
      .append($card.html())
      .height($card.height());
    $card.html('').append($input);
    $input.focus();
  };

  this.handleCardEdit = function(e) {
    var $input = $(e.target);
    var $card = $input.closest('.card');
    var title = $input.val();

    $.post('/cards/' + $card.data('card-id'), {title: title}).then($input.remove);
  };

  this.updateCard = function(card) {
    var $card = $('#card-' + card.id);
    $card.html(self.htmlForCard(card));
    self.sortCards();
  };

  this.sortCards = function(section) {
    if (self.voting) {
      $('.card').tsort('.vote-count', {order: 'desc'});
    }
  };

  this.htmlForCard = function(card) {
    return '<div class="vote-count' + (self.voting ? '' : ' hidden') + '">' + card.votes + '</div>' + window.emojiParser(card.title, '/images/emoji');
  };

  this.setVoting = function(allowVoting) {
    self.voting = allowVoting;
    if (allowVoting) {
      $('.vote-count').show();
    } else {
      $('.vote-count').hide();
    }
  };

  this.setState = function(state) {
    self.setVoting(state.allowVoting);
    self.sortCards();
  };
};

module.exports = CardWall;
