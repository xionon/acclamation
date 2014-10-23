(function() {
  'use strict';

  var Menu = function() {
    var self = this;
    var $menu, $links;

    this.initialize = function() {
      $menu = $('menu');
      $links = $menu.find('a');

      self.loadState()
        .then(self.setState)
        .then(self.socketConnect)
        .then(self.adapt);

      $(window).resize(this.adapt);
      $menu.delegate('a.session-state', 'click', self.handleStateChange);
    };

    this.loadState = function() {
      return $.get('/session/state');
    };

    this.socketConnect = function() {
      var socket = io.connect();
      socket.on('sessionState', self.setState);
    };

    this.setState = function(state) {
      state.allowNewCards ? self.openToNewCards() : self.closeToNewCards();
      state.allowVoting ? self.openVoting() : self.closeVoting();
    };

    this.handleStateChange = function(e) {
      var $link = $(e.target);
      var params = {};
      params[$link.attr('rel')] = $link.attr('data-state');
      $.post('/session/state', params);
    };

    this.adapt = function() {
      var height = $(window).height();
      var $menu = $('menu');

      $menu.show().css('top', height - $menu.outerHeight());
    };

    this.closeToNewCards = function() {
      self.toggleLinks('allowNewCards', 'true');
    };

    this.openToNewCards = function() {
      self.toggleLinks('allowNewCards', 'false');
    };

    this.closeVoting = function() {
      self.toggleLinks('allowVoting', 'true');
    };

    this.openVoting = function() {
      self.toggleLinks('allowVoting', 'false');
    };

    this.endSession = function() {
    };

    this.toggleLinks = function(rel, state) {
      $links.filter('[rel="' + rel + '"]').each(function() {
        var $link = $(this);
        $link.attr('data-state') === state ? $link.show() : $link.hide();
      });
    };

    this.initialize();
  };

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Menu = Menu;
})();
