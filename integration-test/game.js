(function() {
    'use strict';

    var expect = require('chai').expect;
    var page = require('webpage').create();
    var rootUrl = 'http://localhost:3000';
    
    withGame('Example', function() {
        expect(getText('#word')).to.equal('_______');
         
        page.evaluate(function() {
            $(document).ajaxComplete(window.callPhantom);
        });
        
        page.sendEvent('keydown', page.event.key.E);
        page.onCallback = verify(function() {
            expect(getText('#word')).to.equal('E_____E');
            expect(getText('#missedLetters')).to.be.empty;
            
            page.sendEvent('keydown', page.event.key.T);
            page.onCallback = verify(function() {
                expect(getText('#word')).to.equal('E_____E');
                expect(getText('#missedLetters')).to.equal('T');
                
                console.log('Test completed successfully!');
                phantom.exit();
            });
        });
    });
    
    function withGame(word, callback) {
        page.open(rootUrl + '/', function() {
            'use strict';
            page.evaluateAsync(function(w) {
                $('input[name=word]').val(w);
                $('form#createGame').submit();
            }, 0, word);
                
            page.evaluate(function() {
                $(document).ajaxComplete(window.callPhantom);
            });
            
            page.onCallback = function() {
                var gamePath = page.evaluate(function() {
                    return $('#createdGames .game a').first().attr('href');
                });
                
                page.onCallback = undefined;
                page.clearCookies();
                
                page.open(rootUrl + gamePath, verify(callback));
            };
        });
    }
    
    function getText(selector) {
        return page.evaluate(function(s) {
            return $(s).text();
        }, selector);
    }
    
    function verify(expectations) {
        return function() { 
            try {
                expectations();
            } catch(e) {
                console.log('Test failed!');
                handleError(e.message);
            }
        }
    }
    
    function handleError(message) {
        console.log(message);
        phantom.exit(1);
    }
    
    phantom.onError = page.onError = handleError;
}());
