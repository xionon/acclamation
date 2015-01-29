'use strict';

var HeightAdapter = require('./heightAdapter');
var Moderator = require('./moderator');

$(function() {
  window.acclamation = {
    heightAdapter: (new HeightAdapter()),
    moderator: new Moderator()
  };
});
