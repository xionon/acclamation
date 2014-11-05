var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var SessionState = require('../models/sessionState');
var Temperature = require('../models/temperature');
var Card = require('../models/card');
var CardVote = require('../models/cardVote');
var CardRepository = require('../models/card_repository');

/* GET home page. */
router.get('/', function(req, res) {
  'use strict';

  res.redirect('/session/new');
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

router.get('/client/:sessionId', function(req, res) {
  'use strict';

  (new Session()).load(function(session) {
    if (session.id() === null) {
      res.redirect('/session/new');
    } else if (session.id() !== req.params.sessionId) {
      res.redirect('/session/new');
    } else {
      res.render('client');
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

router.get('/session/state', function(req, res) {
  (new SessionState()).load(function(state) {
    res.json(state.toPlainObject());
  });
});

router.post('/session/state', function(req, res) {
  (new SessionState()).load(function(state) {
    state.allowNewCards = req.param('allowNewCards', state.allowNewCards);
    state.allowVoting = req.param('allowVoting', state.allowVoting);
    state.save(function(state) {
      req.io.broadcast('sessionState.changed', state.toPlainObject());
    });
  });

  res.send(202);
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

router.get('/cards', function(req, res) {
  'use strict';

  (new CardRepository()).all(function(cards) {
    var serializedCards = {};

    for (var i = 0; i < cards.length; i++) {
      serializedCards[cards[i].id] = cards[i].toPlainObject();
    }

    res.json({cards: serializedCards});
  });
});

router.post('/cards', function(req, res) {
  'use strict';

  var card = new Card(req.param('card'));
  if (card.isValid()) {
    card.save(function(card) {
      req.io.broadcast('card.created', card.toPlainObject());
    });
    res.send(202);
  } else {
    res.send(422);
  }
});

router.post('/cards/:cardId', function(req, res) {
  'use strict';

  var card = new Card();
  card.load(req.params.cardId, function(card) {
    card.title = req.param('title');
    card.save(function(card) {
      req.io.broadcast('card.updated', card.toPlainObject());
    });
  });

  res.send(202);
});

router.post('/cards/:cardId/fold', function(req, res) {
  'use strict';

  var card = new Card();
  card.load(req.params.cardId, function(card) {
    card.type = 'child-card';
    card.parent = req.param('parent');
    card.save(function(card) {
      req.io.broadcast('card.folded', card.toPlainObject());
    });
  });

  res.send(202);
});

router.post('/cards/:cardId/vote', function(req, res) {
  'use strict';

  var cardVote = new CardVote();
  var value = Number(req.param('value'));

  cardVote.increment(req.params.cardId, value, function(card) {
    var card = new Card();
    card.load(req.params.cardId, function(card) {
      req.io.broadcast('card.vote', card.toPlainObject());
    });
  });

  res.send(202);
});

module.exports = router;
