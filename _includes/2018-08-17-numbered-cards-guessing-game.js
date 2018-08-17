/**
 * Take a standard deck of cards, and pull out the numbered cards from one suit (the cards 2 through
 * 10). Shuffle them, and then lay them face down in a row. Flip over the first card. Now guess
 * whether the next card in the row is bigger or smaller. If you’re right, keep going.
 *
 * If you play this game optimally, what’s the probability that you can get to the end without making
 * any mistakes?
 */

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// @example r(0, 4) - returns 0, 1, 2, or 3
// getRandomInt
function getRandomInt(min, max) {
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
}

function countRemainingCardsHigherOrLower(array, num) {
    var higher = 0;
    var lower = 0;
    array.forEach(function(c) {
        if (c > num) {
            higher++;
        } else {
            lower++;
        }
    });

    return { higher: higher, lower: lower };
}

/**
 * @returns bool - True if you win, false if you lose
 */
function simulateGuessingGame(debug) {
    // Defaults to _not_ output the game status
    debug = typeof debug === 'undefined' ? false : true;

    var cards = shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10]);

    // Pick first card
    var number_card_picked = 1;
    var card_index = getRandomInt(0, cards.length);
    var card = cards.splice(card_index, 1)[0];

    debug && console.log('=== ' + number_card_picked + ' ===');
    debug && console.log('\tFirst card is ' + card);

    var lost_at_game = false;
    while (!lost_at_game && cards.length > 0) {
        debug && console.log('=== ' + ++number_card_picked + ' ===');
        var previous_card = card;

        var higher_and_lower = countRemainingCardsHigherOrLower(cards, previous_card);
        var higher = higher_and_lower.higher;
        var lower = higher_and_lower.lower;

        var choice, chance;
        if (higher > lower) {
            chance = Math.round((higher / (higher + lower)) * 100);
            debug && console.log('\t' + chance + '% it is higher');
            choice = 'HIGHER';
        } else if (lower > higher) {
            chance = Math.round((lower / (higher + lower)) * 100);
            debug && console.log('\t' + chance + '% it is lower');
            choice = 'LOWER';
        } else {
            chance = 50;
            debug && console.log('\t' + '50 / 50 change it is higher or lower');
            choice = Math.random() < 0.5 ? 'HIGHER' : 'LOWER';
        }

        debug && console.log('\t' + 'I am picking: ' + choice);

        // Pick another card
        var card_index = getRandomInt(0, cards.length);
        var card = cards.splice(card_index, 1)[0];

        debug && console.log('\t' + 'Picked ' + card);
        if (choice === 'HIGHER') {
            // Higher
            if (!(card > previous_card)) {
                debug && console.log('\t' + card + ' is NOT HIGHER than ' + previous_card);
                lost_at_game = true;
            }
        } else {
            // Lower
            if (!(card < previous_card)) {
                debug && console.log('\t' + card + ' is NOT LOWER than ' + previous_card);
                lost_at_game = true;
            }
        }

        if (!lost_at_game) {
            debug && console.log('\t' + card + ' IS ' + choice + ' than ' + previous_card);
        }

        debug && console.log('=========');
    }

    if (!lost_at_game) {
        debug && console.log('You Win!');
        return true;
    } else {
        debug && console.log('You Lose!');
        return false;
    }
}

/*
// To simulate a lot of games, run the following

var SIMULATIONS = 1000000;

console.log('Running ' + SIMULATIONS.toLocaleString() + ' times...\n---------\n\n');

var WON_GAME = 0;
for (var i = 0; i < SIMULATIONS; i++) {
    if (simulateGuessingGame()) {
        WON_GAME++;
    }
}

console.log(
    'You won ' +
        WON_GAME.toLocaleString() +
        ' times out of ' +
        SIMULATIONS.toLocaleString() +
        ' (' +
        (WON_GAME / SIMULATIONS) * 100 +
        '%)'
);

*/