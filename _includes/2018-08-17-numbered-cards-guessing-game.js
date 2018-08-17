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

var deck_cache = {};

/**
 * @returns Object - return 'result' (bool if you won or not)
 *                   and optionaly 'log' (string representation of the game)
 */
function simulateGuessingGame(lowest_card, highest_card, debug, log_joiner) {
    var deck = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
        21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,
        39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,
        57,58,59,60];/*,61,62,63,64,65,66,67,68,69,70,71,72,73,74,
        75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,
        93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,
        109,110,111,112,113,114,115,116,117,118,119,120,121,122,
        123,124,125,126,127,128,129,130,131,132,133,134,135,136,
        137,138,139,140,141,142,143,144,145,146,147,148,149,150,
        151,152,153,154,155,156,157,158,159,160,161,162,163,164,
        165,166,167,168,169,170,171,172,173,174,175,176,177,178,
        179,180,181,182,183,184,185,186,187,188,189,190,191,192,
        193,194,195,196,197,198,199,200];*/
    // if (deck_cache[lowest_card + ',' + highest_card]) {
    //     // Get copy of array
    //     deck = deck_cache[lowest_card + ',' + highest_card].slice(0);
    // } else {
    //     // Build our deck and cache it for copying later

    //     // It is actually faster to build the deck every time. Weird!
    //     deck = [];
    //     for (var c = lowest_card; c <= highest_card; c++) {
    //         deck.push(c);
    //     }

    //     deck_cache[lowest_card + ',' + highest_card] = deck.slice(0);
    // }

    var original_deck_length = deck.length;

    // Defaults to returning game log
    debug = typeof debug === 'undefined' ? true : false;

    // Joins log with new lines
    log_joiner = typeof log_joiner === 'undefined' ? '\n' : log_joiner;

    var log = [];

    // var cards = shuffle(deck);
    var cards = deck;

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
            choice = 'HIGHER';//Math.random() < 0.5 ? 'HIGHER' : 'LOWER';
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

    if (!lost_at_game) {
        debug && log.push('You Win!');
    } else {
        debug && log.push('You Lose!');
    }

    var return_val = {
        result: !lost_at_game,
        turns: original_deck_length - cards.length,
        log: log.join(log_joiner),
    };

    return return_val;
}

// To simulate a lot of games, run the following

/*
var SIMULATIONS = 10000000;
var LOWEST = 2;
var HIGHEST = 200;

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
    var game = simulateGuessingGame();
    if (game.result) {
        console.log(game.log);
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




console.log(
    'Running with deck ' +
        2 +
        ' - ' +
        60 +
        'until we win...\n---------\n\n'
);

var CURRENT_SIMULATIONS = 0;
var BEST_TURNS = 0;
while (true) {
    const game = simulateGuessingGame();
    ++CURRENT_SIMULATIONS;
    if (game.turns > BEST_TURNS) {
        console.log('Best Turns: ' + BEST_TURNS);
        BEST_TURNS = game.turns;
    }
    if (game.result) {
        console.log('WE WON!!!!!');
        console.log('It only took ' + CURRENT_SIMULATIONS.toLocaleString() + ' simulations!\n');
        console.log(game.log);
        break;
    }
}

