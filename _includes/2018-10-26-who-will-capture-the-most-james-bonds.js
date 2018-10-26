// ES6 browsers only

let DECK = [];
let deck_nums = [2, 3, 4, 5, 6, 7, 8, 9, 'T', 'J', 'Q', 'K', 'A'];
// let deck_suits = ['S', 'C', 'H', 'D'];
let deck_suits = ['♠', '♥', '♣', '♦'];
const SUIT_COLORS = {
    '♠': 'B',
    '♥': 'R',
    '♣': 'B',
    '♦': 'R'
};
deck_suits.forEach(suit => {
    deck_nums.forEach(card => {
        // Just add "suit" for now, since number doesn't matter
        DECK.push(`${suit}`);
    });
});

// @link https://www.frankmitchell.org/2015/01/fisher-yates/
// Shuffles array in-place
function shuffle(array) {
    var i = 0,
        j = 0,
        temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min = 0, max = 52) {
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomCardIndices(num_cards = 0) {
    let cards_lookup = {};

    let cards_array = Object.keys(cards_lookup);
    do {
        for (let i = cards_array.length; i < num_cards; i++) {
            cards_lookup[getRandomInt()] = true;
        }

        cards_array = Object.keys(cards_lookup);
    } while (cards_array.length < num_cards);

    // Shuffle these cards (will be in ascending order, otherwise)
    shuffle(cards_array);

    // Convert array to integers
    // return cards_array.map(v => +v);

    // Technically this returns an array of strings, but JS is smart enough to use these when getting array inidices
    return cards_array;
}

function testIfHandPassesSortingRequirments(hand) {
    // debugger;
    let suits_lookup = {};
    let black_suit = false;
    let red_suit = false;
    hand.forEach(c => {
        if (c === '♠' || c === '♣') {
            black_suit = true;
        } else if (c === '♥' || c === '♦') {
            red_suit = true;
        }
        suits_lookup[c] = true;
    });
    let suits = Object.keys(suits_lookup);

    if (red_suit && black_suit) {
        let max_groups = suits.length;

        let hand_copy = hand.slice(0);
        let current_card = hand_copy.pop();
        let groups = 1;
        while (hand_copy.length) {
            let next_card = hand_copy.pop();
            if (next_card !== current_card) {
                if (SUIT_COLORS[next_card] === SUIT_COLORS[current_card]) {
                    // Suits of the same color are next to each other!
                    return false;
                }

                current_card = next_card;
                groups++;

                if (groups > max_groups) {
                    // Failed the test!
                    return false;
                }
            }
        }
    } else {
        let max_groups = suits.length;

        let hand_copy = hand.slice(0);

        let current_card = hand_copy.pop();
        let groups = 1;
        while (hand_copy.length) {
            let next_card = hand_copy.pop();
            if (next_card !== current_card) {
                current_card = next_card;
                groups++;

                if (groups > max_groups) {
                    // Failed the test!
                    return false;
                }
            }
        }
    }

    // If we are here, we passed!
    return true;
}

function dealHandAndSeeIfSolvable(hand_size = 6, log = false) {
    let hand_indices = getRandomCardIndices(hand_size);
    let hand = hand_indices.map(i => DECK[i]);

    for (let bunch_size = 1; bunch_size < hand.length; bunch_size++) {
        for (let i = 0; i < hand.length - bunch_size + 1; i++) {
            let remaining_hand = hand.slice(0);
            let group_to_move = remaining_hand.splice(i, bunch_size);

            // Try to insert `group_to_move` at different spots in `remaining_hand`
            for (let j = 0; j < remaining_hand.length + 1; j++) {
                let new_hand = remaining_hand.slice(0);
                new_hand.splice(j, 0, ...group_to_move);
                let new_hand_passed = testIfHandPassesSortingRequirments(new_hand);

                if (new_hand_passed) {
                    if (typeof log === 'function') {
                        log('YES - Hand can be solved!');
                        log(`\tHand: ${hand.join(',')}`);
                        log(
                            `\tGroup: ${group_to_move.join(
                                ','
                            )} (${bunch_size} cards at position ${i})`
                        );
                        log(
                            `\tInsert at ${j} of remaining cards (${remaining_hand.join(',')})`
                        );
                        log(`\tSolved hand: ${new_hand.join(',')}`);
                    }
                    return true;
                }
            }
        }
    }

    // If we are here, we failed
    if (typeof log === 'function') {
        log('NO  - Hand CANNOT be solved');
        log(`\tHand: ${hand.join(',')}`);
    }
    return false;
}


