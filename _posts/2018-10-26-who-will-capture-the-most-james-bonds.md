---
title: Shuffle Up and Deal - Riddler Classic
---

# Shuffle Up and Deal - Riddler Classic

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

<div id="running-status"></div>
<ul id="odds-results"></ul>

<button id="get-sample" style="display: none">Deal out random hand</button>
<br>
<button id="get-winning" style="display: none">Deal out winning hand</button>
<br><input type="number" id="num" style="display: none" min="2" value="6" />
<div id="sample-hand"></div>
<div id="container" style="width: 75%;">
    <canvas id="canvas"></canvas>
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.bundle.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var color = Chart.helpers.color;
        window.chartColors = {
            "red":"rgb(255, 99, 132)",
            "orange":"rgb(255, 159, 64)",
            "yellow":"rgb(255, 205, 86)",
            "green":"rgb(75, 192, 192)",
            "blue":"rgb(54, 162, 235)",
            "purple":"rgb(153, 102, 255)",
            "grey":"rgb(201, 203, 207)"
        };
        var ctx = document.getElementById('canvas').getContext('2d');
        let odds_results_list = document.getElementById('odds-results');
        let running_status = document.getElementById('running-status');

        function appendOddsResult(str) {
            let li = document.createElement('li');
            li.innerHTML = str;
            odds_results_list.appendChild(li);
        }

        var worker = new Worker('{{ "assets/javascript/shuffle-up-and-deal-worker.js" | relative_url }}');

        let hand_sizes = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        let hand_size_labels = hand_sizes.slice(0).map(String);
        hand_size_labels.reverse();

        let current_hand_size = hand_sizes.pop();

        running_status.innerHTML = `Calculating hand size of ${current_hand_size}`;
        worker.postMessage({
            type: 'calculate-odds',
            handSize: current_hand_size,
        });

        // Bar Chart data
        var barChartData = {
            labels: hand_size_labels,
            datasets: [{
                label: 'Results',
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                borderWidth: 1,
                data: []
            }]
        };
        window.myBar = new Chart(ctx, {
            type: 'line',
            data: barChartData,
            options: {
                responsive: true,
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Hand Size'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: '% chance hand dealt can be sorted with one move'
                        },
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
                // legend: false,
                // title: false
            }
        });


        worker.onmessage = function (event) {
            let data = event.data;
            switch (data && data.type) {
                case 'calculate-odds':
                    let odds_percent = parseFloat((data.odds * 100).toFixed(2));
                    appendOddsResult(`Hand of ${data.handSize} cards - ${odds_percent}% chance your dealt hand is "solvable"`)

                    // Adds result to graph
                    barChartData.datasets[0].data.push(odds_percent);
                    window.myBar.update();
                    break;
            }

            if (hand_sizes.length > 0) {
                current_hand_size = hand_sizes.pop();
                running_status.innerHTML = `Calculating hand size of ${current_hand_size}`;
                worker.postMessage({
                    type: 'calculate-odds',
                    handSize: current_hand_size,
                });
            } else {
                running_status.innerHTML = `Finished all calcuations!`;
            }
        };
    });
    

    /*
        let sample_hand = document.getElementById('sample-hand');
        let winning_hand_button = document.getElementById('get-winning');
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
            } while (!result && force_winning);

            sample_hand.innerHTML = '<ul>' + log_str + '</ul>'
        }

        sample_hand_button.addEventListener('click', function(e) {
            outputSampleHand();
        })
        winning_hand_button.addEventListener('click', function(e) {
            sample_hand.innerHTML = 'Finding winning hand...';
            setTimeout(function() {outputSampleHand(true)}, 200);
        })

        setTimeout(function() {
            const SIMULATIONS = 100000;
            let wins = 0;
            for (let i = 0; i < SIMULATIONS; i++) {
                if (dealHandAndSeeIfSolvable(4)) {
                    wins++;
                }
            }

            let game = document.getElementById('game');

            game.innerHTML = `${wins} / ${SIMULATIONS} ≈ ${Math.round(wins / SIMULATIONS * 100)}% a 6-card hand is "solvable"`;

            outputSampleHand(true);
            
            // Display button
            sample_hand_button.style.display = null;
            winning_hand_button.style.display = null;
            num_input.style.display = null;
            
        }, 200)


    });
    */
</script>
<style>
.red {
    color: red;
}
canvas {
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }
</style>
