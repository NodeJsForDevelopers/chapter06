'use strict';

const http = require('http');
const expect = require('chai').expect;

const app = require('../../src/app.js');
const gamesService = require('../../src/services/games.js');

const TEST_PORT = 5000;

describe('/games', () => {
    let userId, server;
    const makeRequest = (method, path, callback) => {
        let headers = {};
        if (userId) {
            headers = { 'Cookie' : `userId=${userId}` };
        }
        http.request({
            method: method,
            port: TEST_PORT,
            path: path,
            headers: headers
        }, callback).end();
    };
    
    before(done => {
        server = http.createServer(app).listen(TEST_PORT, done);
    });
    
    beforeEach(done => {
        makeRequest('GET', '/', (response) => {
            var userIdRegex = /userId=([^;]*)/;
            userId = userIdRegex
                .exec(response.headers['set-cookie'][0])[1];
            done();
        });
    });
    
    afterEach(() => {
        const gamesCreated = gamesService.availableTo("non-user");
        gamesCreated.forEach(game => game.remove());
        userId = null;
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
