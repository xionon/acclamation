(function() {
  var HeightAdapter = function() {
    this.adapt();
    $(window).resize(this.adapt);
  };

  HeightAdapter.prototype.adapt = function() {
    var height = $(window).height();

    ["#qr-code", "#temperature-section"].map(function(div) {
      $(div).css("height", Math.floor(height / 3));
    });

    $("#temperature").attr("height", Math.floor(height / 3));
  };

  window.Acclamation = window.Acclamation || {};
  window.Acclamation.HeightAdapter = HeightAdapter;
})();
