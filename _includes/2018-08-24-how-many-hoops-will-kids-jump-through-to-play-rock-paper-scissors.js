/**
 * Assumes `window.React` global object exists.
 * Also this will only work in browsers that support ES6 features.
 */
const e = React.createElement;

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

const Board = (props = {}) => {
    let { hoops, playerAPosition, playerBPosition } = props;
    return e(
        'ul',
        { className: 'board' },
        Array(hoops).fill().map((s, i) => {
            return e(
                'li',
                { key: i, className: 'board__hoop' },
                i === playerAPosition && i === playerBPosition
                    ? 'AB'
                    : i === playerAPosition ? 'A' : i === playerBPosition ? 'B' : ' '
            );
        })
    );
};

const RockPaperScissorsResult = (props = {}) => {
    let { result, playingRPS } = props;
    return playingRPS && e('span', null, result ? `Player ${result} won!` : 'It was a tie!');
};

class Game extends React.Component {
    constructor(props = {}) {
        super(props);

        let { hoops = 10 } = props;

        this.initial_state = {
            hoops,
            time: 0,
            playerAPosition: 0,
            playerBPosition: hoops - 1,
            playingRPS: false,
            rpsRoundResult: '',
            result: null,
        };

        this.state = Object.assign({}, this.initial_state);

        this.gameInterval;

        this.movePlayersOneStep = this.movePlayersOneStep.bind(this);
        this.playRoundOfRockPaperScissors = this.playRoundOfRockPaperScissors.bind(this);
        this.beginSimulation = this.beginSimulation.bind(this);
    }

    getRandomInt(min = 0, max = 3) {
        // The maximum is exclusive and the minimum is inclusive
        return Math.floor(Math.random() * (max - min)) + min;
    }

    movePlayersOneStep() {
        let { playerAPosition, playerBPosition } = this.state;
        if (playerAPosition < playerBPosition - 1) {
            this.setState({
                playerAPosition: playerAPosition + 1,
                playerBPosition: playerBPosition - 1,
            });

            return true;
        } else {
            return false;
        }
    }

    playRoundOfRockPaperScissors() {
        // return Math.random() < 0.5 ? 'A' : 'B';

        let a_choice = this.getRandomInt();
        let b_choice = this.getRandomInt();

        if (a_choice === b_choice) {
            return '';
        }

        if (a_choice === ROCK) {
            if (b_choice === PAPER) {
                return 'A';
            } else {
                // B chose SCISSORS
                return 'B';
            }
        } else if (a_choice === PAPER) {
            if (b_choice === ROCK) {
                return 'B';
            } else {
                // B chose SCISSORS
                return 'A';
            }
        } else {
            // A chose SCISSORS
            if (b_choice === ROCK) {
                return 'B';
            } else {
                // B chose PAPER
                return 'A';
            }
        }
    }

    isGameOver() {
        let { playerAPosition, playerBPosition, hoops } = this.state;

        if (playerAPosition === 0 && playerBPosition === 1) {
            // B won!
            return 'B';
        } else if (playerBPosition === hoops - 1 && playerAPosition === hoops - 2) {
            // A won!
            return 'A';
        }

        return '';
    }

    /**
     * This will either:
     * - Move players forward
     * - Play a round of RPS
     * - Reset A or B's position if RPS was played and it wasn't a tie
     * - Declare the game over if A or B has won!
     */
    playRoundOfGame() {
        this.setState(prevState => ({
            time: prevState.time + 1,
        }));

        let game_result;
        if ((game_result = this.isGameOver())) {
            clearInterval(this.gameInterval);

            if (game_result === 'A') {
                this.setState({
                    playerAPosition: this.state.hoops - 1,
                    playerBPosition: null,
                    result: 'A',
                });
            } else {
                this.setState({
                    playerAPosition: null,
                    playerBPosition: 0,
                    result: 'B',
                });
            }
        } else if (this.state.playingRPS) {
            if (this.state.rpsRoundResult) {
                // Some player won!
                if (this.state.rpsRoundResult === 'A') {
                    this.setState({
                        playingRPS: false,
                        rpsRoundResult: '',
                        playerBPosition: this.state.hoops - 1,
                    });
                } else {
                    this.setState({
                        playingRPS: false,
                        rpsRoundResult: '',
                        playerAPosition: 0,
                    });
                }
            } else {
                // We played before and tied
                this.setState({
                    rpsRoundResult: this.playRoundOfRockPaperScissors(),
                });
            }
        } else if (!this.state.playingRPS) {
            let players_moved = this.movePlayersOneStep();

            if (!players_moved) {
                // Time to play some RPS!
                this.setState({
                    playingRPS: true,
                    rpsRoundResult: this.playRoundOfRockPaperScissors(),
                });
            }
        }
    }

    beginSimulation(reset_state = false) {
        if (reset_state) {
            this.setState(this.initial_state, () => {
                this.gameInterval = setInterval(() => this.playRoundOfGame(), 200);
            });
        } else {
            this.gameInterval = setInterval(() => this.playRoundOfGame(), 200);
        }
    }

    componentDidMount() {
        this.beginSimulation();
    }

    render() {
        let { hoops, playerAPosition, playerBPosition } = this.state;
        return e(
            React.Fragment,
            null,
            e(
                'div',
                null,
                e('span', null, 'Time: ' + this.state.time),
                this.state.playingRPS && ' - ',
                e(RockPaperScissorsResult, {
                    result: this.state.rpsRoundResult,
                    playingRPS: this.state.playingRPS,
                })
            ),
            e(Board, { hoops, playerAPosition, playerBPosition }),
            this.state.result && e('h3', null, `${this.state.result} won the game!`),
            this.state.result
                ? e(
                      'button',
                      { onClick: () => this.beginSimulation(true) },
                      'Begin Another Simulation'
                  )
                : e('br', null, e('br'), e('br'))
        );
    }
}
