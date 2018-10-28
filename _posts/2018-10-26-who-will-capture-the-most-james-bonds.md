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
<div id="container" style="width: 75%;">
    <canvas id="canvas"></canvas>
</div>

<ul id="odds-results"></ul>


<button id="get-sample">Deal out random hand</button>
<img
    style="display: none"
    src="data:image/gif;base64,R0lGODlhEAAQAPIGAAAAAMLCwkJCQpKSkmJiYoKCgv///wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAGACwAAAAAEAAQAAADM2i63P4wyklrC0IEKgAQnAdOmGYFBLExwboQWcG2rlHEwTDQLUsUOd2mBxkUCgNKa+dIAAAh+QQJCgAGACwAAAIACgAOAAADLWgWIqHQCABEVLPe1R4MBOFFRFNsRUNsYDFewTC8iixvQ1EMyxjEvyBLODQkAAAh+QQJCgAGACwAAAAACgAOAAADLWi6IRJrCQCECoU0ag1xxeBARuEQ0UUU5DUM7fK+qTEUYR0EcM3Ev51uB7wAEwAh+QQJCgAGACwAAAAADgAKAAADLWi6URQrLiJEkSaM0eqrkLFtAVEEAgAIylAUQ5SuSqCFNZjhWG3zmB8wOJQkAAAh+QQJCgAGACwCAAAADgAKAAADK2hqMRMrLuekCnCU8gqBDCZ2glBcYkSUxIJJgQdaUVDOtAAAAr3oPN/llgAAIfkECQoABgAsBgAAAAoADgAAAytoEdauiz0Yx5BQFTvN2EMXWNgUFETZFIJQdERLiGgZtKohAIDQ7T0RrpEAACH5BAkKAAYALAYAAgAKAA4AAAMqaKoR+609Fie1K4zhZiibNRSg1XAQUXQPIQgE835voQgAIARqh+ummSUBACH5BAUKAAYALAIABgAOAAoAAAMsaLpsES2+F9mEddEgBFbBMGACAAiMOCrlGRBFWBQD2L0dYYjfUuQZEKynSAAAOw=="
/>
<!-- <br>
<button id="get-winning">Deal out winning hand</button> -->
<br>
<label>Hand Size: <input type="number" id="num" min="2" value="6" /></label>

<div id="sample-hand"></div>


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
        let sample_hand = document.getElementById('sample-hand');
        let winning_hand_button = document.getElementById('get-winning');
        let sample_hand_button = document.getElementById('get-sample');
        let sample_hand_loading = document.querySelector('#get-sample + img');
        let num_input = document.getElementById('num');

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
                },
                legend: false,
                title: false
            }
        });


        worker.onmessage = function (event) {
            let data = event.data;
            switch (data && data.type) {
                case 'random-hand':
                    sample_hand_loading.style.display = 'none';
                    sample_hand.innerHTML = '<ul>' + data.result + '</ul>';

                    break;
                case 'random-winning-hand':

                    break;
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

        


        // function outputSampleHand(force_winning = false) {
        //     var log_str;
        //     var record_log = str => {
        //         log_str += '<li>' + str + '</li>';
        //     };
            
        //     let num = parseInt(num_input.value, 10);
        //     if (isNaN(num) || num < 1) {
        //       num = 2;
        //     }
        //     do {
        //         log_str = '';
        //         var result = dealHandAndSeeIfSolvable(num, record_log);
        //     } while (!result && force_winning);

        //     sample_hand.innerHTML = '<ul>' + log_str + '</ul>'
        // }

        sample_hand_button.addEventListener('click', function(e) {
            sample_hand_loading.style.display = 'inline-block';
            let num = parseInt(num_input.value, 10);
            if (isNaN(num) || num < 1) {
              num = 2;
            }
            worker.postMessage({
                type: 'random-hand',
                handSize: num,
            });
        })
        // winning_hand_button.addEventListener('click', function(e) {
        //     sample_hand.innerHTML = 'Finding winning hand...';
        //     setTimeout(function() {outputSampleHand(true)}, 200);
        // })
    });
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
