/* global io:false */
'use strict';

var CardWall = require('./cardWall');
var Clock = require('./clock');
var HeightAdapter = require('./heightAdapter');
var Menu = require('./menu');
var Temperature = require('./temperature');

var Moderator = function() {
  var self = this;

  this.socket = io.connect();
  this.cardWall = new CardWall(this);
  this.clock = new Clock(this);
  this.menu = new Menu(this);
  this.temperature = new Temperature(this);

  this.initialize = function() {
    self.socket.emit('ready');
    self.cardWall.socketBind();
    self.menu.socketBind();
    self.temperature.socketBind();
  };

  this.initialize();
};

module.exports = Moderator;
