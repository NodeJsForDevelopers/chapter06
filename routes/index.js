var express = require('express');
var router = express.Router();
var games = require('../services/games');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Hangman',
    userId: req.user.id,
    createdGames: games.createdBy(req.user.id),
    availableGames: games.availableTo(req.user.id),
    partials: { createdGame: 'createdGame' }
  });
});

module.exports = router;
