var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var Temperature = require('../models/temperature');

/* GET home page. */
router.get('/', function(req, res) {
  'use strict';

  res.render('index', { title: 'Express' });
});

router.get('/moderator', function(req, res) {
  'use strict';

  (new Session()).load(function(session) {
    if (session.id() === null) {
      res.redirect('/session/new');
    } else {
      res.render('moderator');
    }
  });
});

router.get('/session/new', function(req, res) {
  'use strict';

  (new Session()).load(function(session) {
    if (session.id() === null) {
      res.render('session-start');
    } else {
      res.render('session-in-progress', { session: session });
    }
  });
});

router.get('/session/start', function(req, res) {
  'use strict';

  (new Session()).create(function(session) {
    res.redirect('/moderator');
  });
});

router.get('/session/qr_code', function(req, res) {
  'use strict';

  (new Session()).load(function(session) {
    if (session.id() === null) {
      res.send(404);
    } else {
      var qr = session.qr();
      res.type('image/png');
      qr.on('data', function(chunk) {
        res.write(chunk);
      });
      qr.on('end', function() {
        res.end();
      });
    }
  });
});

router.get('/temperature', function(req, res) {
  'use strict';

  (new Temperature()).load(function(temperature) {
    res.json(temperature.getValues());
  });
});

router.post('/temperature/vote/:value', function(req, res) {
  'use strict';

  (new Temperature()).increment(req.params.value, function(temperature) {
    temperature.load(function(temperature) {
      req.io.broadcast('temperature', temperature.getValues());
    });
  });

  res.send(202);
});

module.exports = router;
