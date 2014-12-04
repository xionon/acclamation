'use strict';

var async = require('async');
var CardRepository = require('./card_repository');
var Temperature = require('./temperature');

module.exports = function(done) {
  var self = this;
  this.temperature = {};
  this.cards = [];

  function _deepFindCard(haystack, needleId) {
    var subsearch;
    for (var i = 0; i < haystack.length; i++) {
      if (haystack[i].id === needleId) {
        return haystack[i];
      } else if (haystack[i].children !== undefined) {
        subsearch = _deepFindCard(haystack[i].children, needleId);
        if (subsearch !== null) {
          return subsearch;
        }
      }
    }

    return null;
  }

  function loadCards(callback) {
    (new CardRepository()).all(function(cards) {
      callback(null, cards);
    });
  }

  function makeCardTree(cards, callback) {
    var cardsDup = cards.slice();
    var card, parent;

    for (var i = 0; i < cardsDup.length; i++) {
      card = _deepFindCard(cards, cardsDup[i].id);
      if (card !== null && card.parent !== undefined) {
        parent = _deepFindCard(cards, card.parent);
        parent.children = parent.children || [];
        parent.children.push(card);

        for (var j = 0; j < cards.length; j++) {
          if (cards[j].id === card.id) {
            cards.splice(j, 1);
          }
        }
      }
    }

    callback(null, cards);
  }

  function loadAndSortCards(callback) {
    async.waterfall([loadCards, makeCardTree], function(err, results) {
      callback(null, results);
    });
  }

  function loadTemperature(callback) {
    (new Temperature()).load(function(temperature) {
      callback(null, temperature);
    });
  }

  function dataLoaded(err, results) {
    self.cards = results.cards;
    self.temperature = results.temperature.getValues();
    done(self);
  }

  function loadData(callback) {
    async.parallel({
      cards: loadAndSortCards,
      temperature: loadTemperature,
    }, dataLoaded);
  }

  loadData();
};
