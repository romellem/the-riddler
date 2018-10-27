---
title: Organize Cards in One Fell Swoop - Riddler Classic
---

# Organize Cards in One Fell Swoop - Riddler Classic

> ([source](https://fivethirtyeight.com/features/who-will-capture-the-most-james-bonds/))
>
> From Matt Ginsberg, shuffle up and deal … and rearrange … and calculate:
> 
> You love to play cards. Bridge, spades, hearts, euchre, whist, setback, pitch,
> pinochle, bezique, sheepshead, écarté, krutzjass, baloot, königrufen … you name
> it. If there are [tricks to be taken](https://en.wikipedia.org/wiki/Trick-taking_game),
> you want to take them.
> 
> You play so many card games that you’ve developed a very specific organizational
> obsession. When you’re dealt your hand, you want to organize it such that the
> cards of a given suit are grouped together and, if possible, such that no suited
> groups of the same color are adjacent. (Numbers don’t matter to you.) Moreover,
> when you receive your randomly ordered hand, you want to achieve this organization
> with a single motion, moving _only one adjacent block_ of cards to some other
> position in your hand, maintaining the original order of that block and other
> cards, except for that one move.
> 
> Suppose you’re playing [pitch](https://www.pagat.com/allfours/pitch.html),
> in which a hand has six cards. What are the odds that you can accomplish your
> obsessive goal? What about for another game, where a hand has _N_ cards,
> somewhere between 1 and 13?
> 
> _Editor’s note_: Matt has no idea what the answer is (yet). His guess, for the
> record, is 57 percent.

---

## Results

<div id="game">Running...</div>

<button id="get-sample" style="display: none">Deal out random hand</button>
<br><input type="number" id="num" style="display: none" min="2" value="6" />
<div id="sample-hand"></div>

<style>
.red {
    color: red;
}
</style>
    
<script>
    {% include 2018-10-26-who-will-capture-the-most-james-bonds.js %}

    

    document.addEventListener('DOMContentLoaded', function() {
        let sample_hand = document.getElementById('sample-hand');
        let sample_hand_button = document.getElementById('get-sample');
        let num_input = document.getElementById('num');
        function outputSampleHand(force_winning = false) {
            var log_str;
            var record_log = str => {
                log_str += '<li>' + str + '</li>';
            };
            
            let num = parseInt(num_input.value, 10);
            if (isNaN(num) || num < 1) {
              num = 2;
            }
            do {
                log_str = '';
                var result = dealHandAndSeeIfSolvable(num, record_log);
            } while (result && force_winning);

            sample_hand.innerHTML = '<ul>' + log_str + '</ul>'
        }

        sample_hand_button.addEventListener('click', function(e) {
            outputSampleHand();
        })

        setTimeout(function() {
            const SIMULATIONS = 10000;
            let wins = 0;
            for (let i = 0; i < SIMULATIONS; i++) {
                if (dealHandAndSeeIfSolvable(6)) {
                    wins++;
                }
            }

            let game = document.getElementById('game');

            game.innerHTML = `${wins} / ${SIMULATIONS} ≈ ${Math.round(wins / SIMULATIONS * 100)}% a 6-card hand is "solvable"`;

            outputSampleHand(true);
            
            // Display button
            sample_hand_button.style.display = null;
            num_input.style.display = null;
            
        }, 200)


    });
</script>
