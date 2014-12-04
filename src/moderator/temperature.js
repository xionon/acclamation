/* global Chart:false, io:false */
'use strict';

var Temperature = function(container) {
  var self = this;

  this.container = $(container);
  this.chart = null;

  this.initialize = function() {
    this.load().then(self.render).then(self.socketConnect);
  };

  this.socketConnect = function() {
    var socket = io.connect();
    socket.on('temperature', self.render);
  };

  this.load = function() {
    return $.get('/temperature');
  };

  this.initializeChart = function(data) {
    self.chart = new Chart(self.container.get(0).getContext('2d')).Bar({
      labels: ['1', '2', '3', '4', '5'],
      datasets: [
        {
          label: 'Temperature',
          fillColor: 'rgba(64, 159, 210, 0.7)',
          data: [0, 0, 0, 0, 0]
        }
      ]
    }, {responsive: true});
  };

  this.render = function(data) {
    if (!(self.chart)) {
      self.initializeChart();
    }

    $.each(data, function(key, val) {
      self.chart.datasets[0].bars[self.normalizeKey(key)].value = val;
    });

    self.chart.update();
  };

  this.normalizeKey = function(key) {
    return (Number(key) - 1);
  };

  this.initialize();
};

module.exports = Temperature;
