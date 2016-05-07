$(function() {
    'use strict';
    
    var word = $('#word');
    var length = word.data('length');
    
    // Create placeholders for each letter
    for (var i = 0; i < length; ++i) {
        word.append('<span>_</span>');
    }
    
    var guessedLetters = [];
    var guessLetter = function(letter) {
        $.post('guesses', { letter: letter })
            .done(function(data) {
                if (data.positions.length) {
                    data.positions.forEach(function(position) {
                        word.find('span').eq(position).text(letter);
                    });
                } else {
                    $('#missedLetters')
                        .append('<span>' + letter + '</span>');
                }
            }); 
    }
    
    $(document).keydown(function(event) {
        // Letter keys have key codes in the range 65-90
        if (event.which >= 65 && event.which <= 90 ) {
            var letter = String.fromCharCode(event.which);
            if (guessedLetters.indexOf(letter) === -1) {
                guessedLetters.push(letter);
                guessLetter(letter);
            }
        }
    });
});
