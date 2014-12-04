'use strict';

var CardWall = require('./cardWall');
var Clock = require('./clock');
var HeightAdapter = require('./heightAdapter');
var Menu = require('./menu');
var Temperature = require('./temperature');

$(function() {
  window.acclamation = {
    cardWall: (new CardWall()),
    clock: (new Clock('#clock')),
    heightAdapter: (new HeightAdapter()),
    menu: (new Menu()),
    temperature: (new Temperature('#temperature'))
  };
});
