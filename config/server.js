'use strict';
var numCPU = require('os').cpus().length;

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:8000',
  numWorkers: process.env.NUM_WORKERS || numCPU,
  port: process.env.PORT || 8000
};
