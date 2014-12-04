'use strict';

var AddCard = function(client) {
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

module.exports = AddCard;
