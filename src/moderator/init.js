'use strict';

var CardWall = require('./cardWall');
var Clock = require('./clock');
var HeightAdapter = require('./heightAdapter');
var Menu = require('./menu');
var Temperature = require('./temperature');
var Moderator = require('./moderator');

$(function() {
  window.acclamation = {
    heightAdapter: (new HeightAdapter()),
    moderator: new Moderator()
  };
});
