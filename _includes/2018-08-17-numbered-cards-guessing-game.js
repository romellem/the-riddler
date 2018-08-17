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
 * @returns Object - return 'result' (bool if you won or not)
 *                   and optionaly 'log' (string representation of the game)
 */
function simulateGuessingGame(lowest_card, highest_card, debug, log_joiner) {
    var deck = [];
    for (var c = lowest_card; c <= highest_card; c++) {
        deck.push(c);
    }

    // Defaults to _not_ returning game log
    debug = typeof debug === 'undefined' ? false : true;

    // Joins log with new lines
    log_joiner = typeof log_joiner === 'undefined' ? '\n' : log_joiner;

    var log = [];

    var cards = shuffle(deck);

    // Pick first card
    var number_card_picked = 1;
    var card_index = getRandomInt(0, cards.length);
    var card = cards.splice(card_index, 1)[0];

    debug && log.push('=== ' + number_card_picked + ' ===');
    debug && log.push('\tFirst card is ' + card);

    var lost_at_game = false;
    while (!lost_at_game && cards.length > 0) {
        debug && log.push('=== ' + ++number_card_picked + ' ===');
        var previous_card = card;

        var higher_and_lower = countRemainingCardsHigherOrLower(cards, previous_card);
        var higher = higher_and_lower.higher;
        var lower = higher_and_lower.lower;

        var choice, chance;
        if (higher > lower) {
            chance = Math.round((higher / (higher + lower)) * 100);
            debug && log.push('\t' + chance + '% it is higher');
            choice = 'HIGHER';
        } else if (lower > higher) {
            chance = Math.round((lower / (higher + lower)) * 100);
            debug && log.push('\t' + chance + '% it is lower');
            choice = 'LOWER';
        } else {
            chance = 50;
            debug && log.push('\t' + '50 / 50 change it is higher or lower');
            choice = Math.random() < 0.5 ? 'HIGHER' : 'LOWER';
        }

        debug && log.push('\t' + 'I am picking: ' + choice);

        // Pick another card
        var card_index = getRandomInt(0, cards.length);
        var card = cards.splice(card_index, 1)[0];

        debug && log.push('\t' + 'Picked ' + card);
        if (choice === 'HIGHER') {
            // Higher
            if (!(card > previous_card)) {
                debug && log.push('\t' + card + ' is NOT HIGHER than ' + previous_card);
                lost_at_game = true;
            }
        } else {
            // Lower
            if (!(card < previous_card)) {
                debug && log.push('\t' + card + ' is NOT LOWER than ' + previous_card);
                lost_at_game = true;
            }
        }

        if (!lost_at_game) {
            debug && log.push('\t' + card + ' IS ' + choice + ' than ' + previous_card);
        }

        debug && log.push('=========');
    }

    var return_val;
    if (!lost_at_game) {
        debug && log.push('You Win!');
        return_val = { result: true };
    } else {
        debug && log.push('You Lose!');
        return_val = { result: false };
    }

    if (debug) {
        return_val.log = log.join(log_joiner);
    }

    return return_val;
}

/*
// To simulate a lot of games, run the following

var SIMULATIONS = 1000000;

console.log('Running ' + SIMULATIONS.toLocaleString() + ' times...\n---------\n\n');

var WON_GAME = 0;
for (var i = 0; i < SIMULATIONS; i++) {
    if (simulateGuessingGame(2, 10).result) {
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