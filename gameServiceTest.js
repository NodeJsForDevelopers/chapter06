'use strict';

let assert = require('assert');
let service = require('./services/games.js')

// Given
service.create('firstUserId', 'testing');

// When
let games = service.availableTo('secondUserId');

// Then
assert.equal(games.length, 1);
let game = games[0];
assert.equal(game.setBy, 'firstUserId');
assert.equal(game.word, 'TESTING');
