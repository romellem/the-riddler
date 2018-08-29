---
title: Numbered Cards Guessing Game
---

# Numbered Cards Guessing Game


> ([source](https://fivethirtyeight.com/features/step-1-game-theory-step-2-step-3-profit/))
>
> From Freddie Simmons, a guessing game:
>
> Take a standard deck of cards, and pull out the numbered cards from one suit (the cards 2 through
> 10). Shuffle them, and then lay them face down in a row. Flip over the first card. Now guess
> whether the next card in the row is bigger or smaller. If you’re right, keep going.
>
> If you play this game optimally, what’s the probability that you can get to the end without making
> any mistakes?
>
> _Extra credit_: What if there were more cards — 2 through 20, or 2 through 100? How do your chances
> of getting to the end change?

---

## Answer

After running a simulation millions of times, the probability of "winning"
with a deck of cards 2 through 10 is:

**\~17%**.

### Calculate Chance of Winning with a Certain Deck

Lowest Card:
<input type="number" id="lowest-card" name="lowest-card"
           placeholder="Minimum value of 2"
           min="10" value="2" />

Highest Card:
<input type="number" id="highest-card" name="highest-card"
           placeholder="Minimum value of 3"
           min="3" value="10" />

_Simulations_:
<input type="number" id="total-simulations" name="total-simulations" value="1000000" step="100" />

<button id="get-percentage-chance">Calculate chance of winning game with above deck</button>

<p id="complete-result">Running with deck of 2 - 10...</p>

### Simulate a Single Game with Above Deck

<button id="simulate">Simulate one game with above deck</button>
<h2 id="result"></h2>
<pre id="log" style="display: none"></pre>

<script>
{% include 2018-08-17-numbered-cards-guessing-game.js %}

document.addEventListener('DOMContentLoaded', function() {
    var log = document.getElementById('log');
    var result = document.getElementById('result');
    var lowest = document.getElementById('lowest-card');
    var highest = document.getElementById('highest-card');

    // Wait 500ms, and simulate our game a million times
    var calculateChanceOfWinning = function(force_lowest, force_highest) {
        var SIMULATIONS = parseInt(document.getElementById('total-simulations').value);
        if (!(SIMULATIONS > 0)) {
            SIMULATIONS = 1000000
        }

        console.log('Running ' + SIMULATIONS.toLocaleString() + ' times...\n---------\n\n');

        var lowest_value = force_lowest || parseInt(lowest.value);
        var highest_value = force_highest || parseInt(highest.value);

        var WON_GAME = 0;
        for (var i = 0; i < SIMULATIONS; i++) {
            if (simulateGuessingGame(lowest_value, highest_value).result) {
                WON_GAME++;
            }
        }

        var complete_results_string =
            'You won ' +
            WON_GAME.toLocaleString() +
            ' times out of ' +
            SIMULATIONS.toLocaleString() +
            ' (' +
            (WON_GAME / SIMULATIONS) * 100 +
            '%)' + ' with a deck of ' +
            lowest_value + ' - ' + highest_value;

        console.log(complete_results_string);

        document.getElementById('complete-result').innerHTML = complete_results_string;
    }
    setTimeout(function() { calculateChanceOfWinning(2, 10) }, 500);

    document.getElementById('get-percentage-chance').addEventListener('click', function(e) {
        document.getElementById('complete-result').innerHTML =
            'Running with deck of ' + lowest.value + ' - ' + highest.value;
        setTimeout(calculateChanceOfWinning, 250);
    });

    document.getElementById('simulate').addEventListener('click', function(e) {
        var game = simulateGuessingGame(parseInt(lowest.value), parseInt(highest.value), true);

        if (log.style.display === 'none') {
            log.style.display = 'block';
        }

        if (game.result) {
            result.style.color = 'green';
            result.innerHTML = 'You Won! You played all ' + game.turns + ' cards within the deck!';
        } else {
            result.style.color = 'red';
            result.innerHTML = 'You Lost! (Played ' + game.turns + ' turns before you lost)';
        }

        log.innerHTML = game.log;
    });
});

</script>