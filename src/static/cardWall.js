(function() {
  'use strict';

  var CardWall = function() {
    var self = this;

    this.initialize = function() {
      self.load().then(self.renderAll).then(self.socketConnect);
      $(self.setupEvents);
    };

    this.socketConnect = function() {
      var socket = io.connect();
      socket.on('card.created', self.appendCard);
      socket.on('card.folded', self.foldCard);
    };

    this.load = function() {
      return $.get('/cards');
    };

    this.renderAll = function(data) {
      $.each(data.cards, function(id, card) {
        self.appendCard(card);
      });
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
        .data('card-votes', card.votes)
        .html(card.title)
        .hide()
        .draggable({containment: '#moderator', cursor: 'move', stack: '.card'})
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
      var $parent = $('#card-' + card.parent);
      var $card = $('#card-' + card.id);

      $card.remove();
    };

    this.setupEvents = function() {
      $('.card-column').delegate('.card', 'dblclick', self.editCard);
      $('.card-column').delegate('input', 'blur', self.updateCard);
    };

    this.editCard = function(e) {
      var $card = $(e.target);
      var $input;

      if ($card.find('input').length > 0) {
        return;
      }

      $input = $('<input/>')
        .attr('type', 'text')
        .val($card.html());
      $card.html('').append($input);
    };

    this.updateCard = function(e) {
      var $input = $(e.target);
      var $card = $input.closest('.card');

      $input.remove();
      $card.html($input.val());
    };

    this.initialize();
  };

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.CardWall = CardWall;
})();
