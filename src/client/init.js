'use strict';

var Client = require('./client');

window.acclamation = {
  client: new Client()
};

$(function() {
  window.acclamation.client.initialize();
});
