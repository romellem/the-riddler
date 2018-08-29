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
    var deck = Array.isArray(lowest_card) ? lowest_card : [];
    if (deck.length === 0) {
        for (var c = lowest_card; c <= highest_card; c++) {
            deck.push(c);
        }
    }

    var original_deck_length = deck.length;

    // Defaults to returning game log
    debug = typeof debug === 'undefined' ? true : false;

    // Joins log with new lines
    log_joiner = typeof log_joiner === 'undefined' ? '\n' : log_joiner;

    var log = [];

    var cards = Array.isArray(lowest_card) ? deck.slice(0) : shuffle(deck);
    var original_cards = cards.toString();

    // Pick first card
    var number_card_picked = 1;
    var card = cards.pop();

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
            choice = 'HIGHER'; //Math.random() < 0.5 ? 'HIGHER' : 'LOWER';
        }

        debug && log.push('\t' + 'I am picking: ' + choice);

        // Pick another card
        var card = cards.pop();

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

    if (!lost_at_game) {
        debug && log.push('You Win!');
    } else {
        debug && log.push('You Lose!');
    }

    var return_val = {
        result: !lost_at_game,
        turns: original_deck_length - cards.length,
        log: log.join(log_joiner),
        deck: original_cards,
    };

    return return_val;
}

// To simulate a lot of games, run the following

let attempt = [
    89,86,16,87,54,90,91,60,88,68,
    41,11,8,81,43,23,77,67,51,47,97,
    15,12,72,44,39,28,95,50,56,53,32,
    13,85,18,5,3,55,71,42,26,21,74,
    36,84,100,4,58,82,10,62,19,57,40,
    64,48,29,61,76,46,65,7,63,22,75,
    20,92,49,93,33,66,52,70,45,83,27,
    96,35,2,79,94,24,17,73,34,59,14,9,
    78,99,25,80,38,31,69,37,6,98,30
];
var game = simulateGuessingGame(attempt);
console.log(game.log)

/*
var SIMULATIONS = 5000000;
var LOWEST = 2;
var HIGHEST = 10;

console.log(
    'Running ' +
        SIMULATIONS.toLocaleString() +
        ' times with deck ' +
        LOWEST +
        ' - ' +
        HIGHEST +
        '...\n---------\n\n'
);

var WON_GAME = 0;
for (var i = 0; i < SIMULATIONS; i++) {
    var game = simulateGuessingGame(LOWEST, HIGHEST, false);
    if (game.result) {
        // console.log(game.log);
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

// var LOWEST = 2;
// var HIGHEST = 100;

// console.log('Running with deck ' + LOWEST + ' - ' + HIGHEST + ' until we win...\n---------\n\n');

// var CURRENT_SIMULATIONS = 0;
// var BEST_TURNS = 0;
// while (true) {
//     const game = simulateGuessingGame(LOWEST, HIGHEST);
//     ++CURRENT_SIMULATIONS;
//     if (CURRENT_SIMULATIONS % 25000000 === 0) {
//         console.log(new Date() + ' ' + CURRENT_SIMULATIONS.toLocaleString() + ' simultations so far...');
//     }
//     if (game.turns > BEST_TURNS) {
//         console.log(new Date() + ' Best Turns: ' + BEST_TURNS);
//         console.log('Made with: [' + game.deck + ']');
//         BEST_TURNS = game.turns;
//     }
//     if (game.result) {
//         console.log('WE WON!!!!!');
//         console.log('It only took ' + CURRENT_SIMULATIONS.toLocaleString() + ' simulations!\n');
//         console.log(game.log);
//         break;
//     }
// }
