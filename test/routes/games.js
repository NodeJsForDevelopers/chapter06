'use strict';

const request = require('supertest');
const expect = require('chai').expect;

const app = require('../../src/app.js');
const gamesService = require('../../src/services/games.js');

describe('/games', () => {
    let agent, userId;
    
    beforeEach(done => {
        agent = request.agent(app);
        agent
            .get('/')
            .end((error, response) => {
                var userIdRegex = /userId=([^;]*)/;
                userId = userIdRegex
                  .exec(response.headers['set-cookie'])[1];
                done();
            });
    });
    
    describe('/:id DELETE', () => {
        it('should allow users to delete their own games', done => {
            gamesService.create(userId, 'test');
            let game = gamesService.createdBy(userId)[0];
            
            agent
                .delete('/games/' + game.id)
                .expect(200)
                .expect(() =>
                  expect(gamesService.createdBy(userId)).to.be.empty)
                .end(done);
        });
        
        it('should not allow users to delete games that they did not set', done => {
            const game = gamesService.create('another-user-id', 'test');
            agent
                .delete('/games/' + game.id)
                .expect(403)
                .expect(() => expect(gamesService.get(game.id).ok))
                .end(done);
        });

        it('should return a 404 for requests to delete a game that does not exist', done => {
            agent
                .delete('/games/notAGame')
                .expect(404, done);
        });
    });
});
