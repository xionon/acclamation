(function() {
  'use strict';

  var Menu = function() {
    this.adapt();
    $(window).resize(this.adapt);
  };

  Menu.prototype.adapt = function() {
    var height = $(window).height();
    var $menu = $('menu');

    $menu.css('top', height - $menu.outerHeight());
  };

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.Menu = Menu;
})();
