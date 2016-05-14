'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const gamesService = require('../../src/services/games.js');

const TEST_PORT = 5000, userId = 'test-user-id';

describe('/games', () => {
    let server;
    const makeRequest = (method, path, callback) => {
        http.request({
            method: method,
            port: TEST_PORT,
            path: path
        }, callback).end();
    };
    
    before(done => {
        const app = express();
        app.use(bodyParser.json());
        app.use((req, res, next) => { req.user = { id: userId }; next(); });
        
        const games = require('../../src/routes/games.js');
        app.use('/games', games);
        
        server = http.createServer(app).listen(TEST_PORT, done);
    });
    
    afterEach(() => {
        const gamesCreated = gamesService.availableTo("non-user");
        gamesCreated.forEach(game => game.remove());
    });
    
    after(done => {
        server.close(done);
    });
    
    describe('/:id DELETE', () => {
        it('should allow users to delete their own games', done => {
            const game = gamesService.create(userId, 'test');
            
            makeRequest('DELETE', '/games/' + game.id, response => {
                expect(response.statusCode).to.equal(200);
                expect(gamesService.createdBy(userId)).to.be.empty;
                done();
            });
        });
    });
});
