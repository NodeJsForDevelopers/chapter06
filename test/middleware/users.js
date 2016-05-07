'use strict';

const middleware = require('../../src/middleware/users.js');
const expect = require('chai').expect;

describe('Users middleware', () => {
    const defaultUserId = 'user-id-1';
    let request, response;
    
    beforeEach(() => {
        request = { cookies: {} };
        response = { cookie: () => {} };
    });
    
    it('if the user already signed in, reads their ID from a cookie and exposes the user on the request', () => {
        // Given
        request.cookies.userId = defaultUserId;
        
        // When
        middleware(request, response, () => {});
        
        // Then
        expect(request.user).to.exist;
        expect(request.user.id).to.equal(defaultUserId);
    });
    
    it('calls the next middleware in the chain', () => {
        // Given
        let calledNext = false;
        const next = () => calledNext = true;
        
        // When
        middleware(request, response, next);
        
        // Then
        expect(calledNext).to.be.true
    });
});
