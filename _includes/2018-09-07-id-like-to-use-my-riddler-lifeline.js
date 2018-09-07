// ES6 browsers only

const STRATEGIES = {
    IMMEDIATE_WALK: {
        description: 'Immediately walk and receive a guaranteed $250,000.',
        average: 250000,
    },

    FIFTY_FIFTY_THEN_WALK: {
        description: `Use the 50/50 lifeline and guess on the answer. If you get it correct,
                        walk and take the $500,000`,
        average: undefined,
    },

    FIFTY_FIFTY_FIRST_AUDIENCE_SECOND: {
        description: `Use the 50/50 lifeline and guess on the answer. If you get it correct,
                        ask the audience for the final question, and select their top response.`,
        average: undefined,
    },

    FIFTY_FIFTY_AND_ASK_AUDIENCE_ON_FIRST: {
        description: `Use the 50/50 lifeline, then use Ask the Audience and select their
                        top response. If you get it correct, walk.`,
        average: undefined,
    },

    GUESS_ON_FIRST_THEN_USE_BOTH_LIFELINES_ON_LAST: {
        description: `Guess on the first question, then use both the 50/50 lifeline and
                        Ask the Audience and select their top response.`,
        average: undefined,
    },
};

const runStrategyAndUpdateResults = (strategy, num_of_simulations = 1000000, callback) => {
    let results = [];

    if (strategy === 'IMMEDIATE_WALK') {
        return 250000;
    }

    for (let i = 0; i < num_of_simulations; i++) {
        let first_question, second_question;
        switch (strategy) {
            case 'FIFTY_FIFTY_THEN_WALK':
                first_question = Math.random() < 0.5;

                if (first_question) {
                    results.push(500000);
                } else {
                    // You lost
                    results.push(10000);
                }
                break;

            case 'FIFTY_FIFTY_FIRST_AUDIENCE_SECOND':
                first_question = Math.random() < 0.5;

                if (first_question) {
                    // Got first question, ask audience for second question (which is essentially another coin flip)
                    second_question = Math.random() < 0.5;

                    if (second_question) {
                        // You lost
                        results.push(1000000);
                    } else {
                        // You lost
                        results.push(10000);
                    }
                } else {
                    // You lost
                    results.push(10000);
                }
                break;

            case 'FIFTY_FIFTY_AND_ASK_AUDIENCE_ON_FIRST':
                first_question = Math.random() < 0.65;

                if (first_question) {
                    results.push(500000);
                } else {
                    // You lost
                    results.push(10000);
                }
                break;

            case 'GUESS_ON_FIRST_THEN_USE_BOTH_LIFELINES_ON_LAST':
                first_question = Math.random() < 0.25;
                if (first_question) {
                    // Got first question, use both lifelines on final question
                    second_question = Math.random() < 0.65;

                    if (second_question) {
                        // You lost
                        results.push(1000000);
                    } else {
                        // You lost
                        results.push(10000);
                    }
                } else {
                    // You lost
                    results.push(10000);
                }
                break;

            default:
        }
    }

    // Updates average
    STRATEGIES[strategy].average = results.reduce((a, b) => a + b, 0) / results.length;

    if (callback) {
        callback();
    }
};

let strategies_names = Object.keys(STRATEGIES);
let results = document.getElementById('game');
const runStrategiesOnTimer = () => {
    let current_strategy = strategies_names.shift();
    if (current_strategy) {
        setTimeout(
            () =>
                runStrategyAndUpdateResults(current_strategy, undefined, () => {
                    // UL element is inserted into the DOM prio to this running (fragile)
                    let ul = document.getElementById('list');
                    let { description, average } = STRATEGIES[current_strategy];

                    let li = document.createElement('li');
                    li.innerHTML = `<b>Description</b>: ${description}<br><b>Average</b>: ${average.toLocaleString()}`;

                    ul.appendChild(li);
                    runStrategiesOnTimer();
                }),
            1000
        );
    } else {
        let done_element = document.createElement('h5');
        done_element.style.color = 'green';
        done_element.innerHTML = 'Completed!';
        results.appendChild(done_element);
    }
};

// Run this on DOM ready
const runEntireSimulation = () => {
    setTimeout(() => {
        let { description, average } = STRATEGIES.IMMEDIATE_WALK;
        results.innerHTML = `
            <ul id="list">
                <li><b>Description</b>: ${description}<br><b>Average</b>: ${average.toLocaleString()}</li>
            </ul>
        `;

        // Remove dummy first "IMMEDIATE_WALK" strategy
        strategies_names.shift();

        // Kick off remaining tests!
        runStrategiesOnTimer();
    }, 500);
};
