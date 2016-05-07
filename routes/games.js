'use strict';

const express = require('express');
const router = express.Router();
const service = require('../services/games');

router.post('/', function(req, res, next) {
    const word = req.body.word;
    if (word && /^[A-Za-z]{3,}$/.test(word)) {
        service.create(req.user.id, word);
        res.redirect('/');
    } else {
        res.status(400).send('Word must be at least three characters long and contain only letters');
    }
});

module.exports = router;