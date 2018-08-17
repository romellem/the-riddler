---
title: Numbered Cards Guessing Game
---

# Numbered Cards Guessing Game


> ([source](https://fivethirtyeight.com/features/step-1-game-theory-step-2-step-3-profit/))

> From Freddie Simmons, a guessing game:

> Take a standard deck of cards, and pull out the numbered cards from one suit (the cards 2 through
> 10). Shuffle them, and then lay them face down in a row. Flip over the first card. Now guess
> whether the next card in the row is bigger or smaller. If you’re right, keep going.

> If you play this game optimally, what’s the probability that you can get to the end without making
> any mistakes?

> _Extra credit_: What if there were more cards — 2 through 20, or 2 through 100? How do your chances
> of getting to the end change?

---

## Solution

<button id="simulate">Simulate!</button>
<pre id="results"></pre>

<script>
{% include 2018-08-17-numbered-cards-guessing-game.js %}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('simulate').addEventListener('click', function(e) {
        var result = simulateGuessingGame(true);
        document.getElementById('simulate').innerHTML = result.log;
    })
});
</script>