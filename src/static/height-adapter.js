(function() {
  'use strict';

  var HeightAdapter = function() {
    this.adapt();
    $(window).resize(this.adapt);
  };

  HeightAdapter.prototype.adapt = function() {
    var QR_CODE_HEIGHT = 292;
    var PADDING = 64;
    var chartHeight = $(window).height() - QR_CODE_HEIGHT - $('#clock').outerHeight() - PADDING;

    $('#temperature-section').css('height', chartHeight);
    $('#temperature').attr('height', chartHeight);
  };

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.HeightAdapter = HeightAdapter;
})();
