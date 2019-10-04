/**
 * Riddler League Baseball, also known as the RLB, consists of three teams:
 * the Mississippi Moonwalkers, the Delaware Doubloons and the Tennessee Taters.
 *
 * Each time a batter for the Moonwalkers comes to the plate, they have a
 * 40 percent chance of getting a walk and a 60 percent chance of striking
 * out. Each batter for the Doubloons, meanwhile, hits a double 20 percent
 * percent of the time, driving in any teammates who are on base, and strikes
 * out the remaining 80 percent of the time. Finally, each batter for the Tatershas
 * a 10 percent chance of hitting a home run and a 90 percent chance of striking out.
 *
 * During the RLB season, each team plays an equal number of games against
 * each opponent. Games are nine innings long and can go into extra innings
 * just like in other baseball leagues. Which of the three teams is most
 * likely to have the best record at the end of the season?
 */
const { green, red, cyan, blue, magenta, yellow } = require('chalk');

class Team {
	constructor(name, strikeout, hit, hit_action) {
		this.name = name;

		// Technically we only use the `strikeout` percentage. ¯\_(ツ)_/¯
		this.strikeout = strikeout;
		this.hit = hit;

		this.hit_action = hit_action;
	}

	bat() {
		if (Math.random() < this.strikeout) {
			// Out
			return { result: 'out' };
		} else {
			// Hit! return our action
			return Object.assign({}, this.hit_action);
		}
	}
}

class Game {
	constructor({ home_team, away_team, log = false }) {
		// Math is easier with 18 innings. Odd is 'top' (away bats), even is 'bottom' (home bats)
		this.inning = 1;
		this.home_team = home_team;
		this.away_team = away_team;

		this.home_score = 0;
		this.away_score = 0;

		this.outs;
		this.bases = [false, false, false];

		this.log = log;
	}

	halfInning() {
		let log = this.log;
		let offense, score_str;

		if (this.inning % 2 === 0) {
			// Bottom of the inning, home bats
			offense = this.home_team;
			score_str = 'home_score';
		} else {
			offense = this.away_team;
			score_str = 'away_score';
		}

		this.outs = 0;


		log && console.log(`\n${cyan(this.inningToString())}: ${blue(offense.name)} up to bat (${this.currentScoreToString()})`);

		while (this.outs < 3) {
			let at_bat = offense.bat();
			const { result } = at_bat;

			switch (result) {
				case 'out':
					this.outs++;
					log && console.log(`${red('Out!')} (${this.outs} outs)`);
					break;

				case 'walk':
					// Wow this is convoluted...
					this.bases.unshift(true);

					if (this.bases[3] === true) {
						this[score_str]++;
						log && console.log(`${green('Walk, scores a run!')} (${this.currentScoreToString()})`);
					} else {
						log && console.log(`${green('Walk!')} (${magenta(this.bases.filter(v => v).length)} men on base)`);
					}

					this.bases.pop();
					break;

				case 'double':
					if (this.bases[1] === true) {
						this[score_str]++;
						log && console.log(`${green('Double, scores a run!')} (${this.currentScoreToString()})`);
					} else {
						log && console.log(`${green('Double, runner on base')}`);
					}

					this.bases[1] = true;
					break;

				case 'home_run':
					this[score_str]++;
					log && console.log(`${green('Home run!')} (${this.currentScoreToString()})`);
					break;
			}
		}
		
		this.bases = [false, false, false];
		this.inning++;
	}

	play() {
		let log = this.log;
		log && console.log(`${yellow(this.home_team.name.toUpperCase())} vs ${yellow(this.away_team.name.toUpperCase())}`);
		for (let i = 0; i < 18; i++) {
			this.halfInning();
		}

		while (this.home_score === this.away_score) {
			this.halfInning();
			this.halfInning();
		}

		log && console.log(`==================\n${blue('Final score')} | ${this.currentScoreToString()}\n==================`);

		// Return winning teams name
		return this.home_score > this.away_score ? this.home_team.name : this.away_team.name;
	}

	inningToString() {
		let true_inning = Math.ceil(this.inning / 2);
		return (this.inning % 2 === 0 ? 'Bottom' : 'Top') + ' of the ' + true_inning;
	}

	currentScoreToString() {
		return `${this.home_team.name}: ${magenta(this.home_score)} - ${this.away_team.name}: ${magenta(this.away_score)}`;
	}
}

const moonwalker = new Team('moonwalker', 0.6, 0.4, { result: 'walk' });
const doubloons = new Team('doubloons', 0.8, 0.2, { result: 'double' });
const taters = new Team('taters', 0.9, 0.1, { result: 'home_run' });

// Hardcode the matchups

let matchups = [
	[moonwalker, doubloons],
	[doubloons, moonwalker],
	[moonwalker, taters],
	[taters, moonwalker],
	[doubloons, taters],
	[taters, doubloons],
];

// 1_000_000
const SIMULATIONS = 1;

const wins = {
	moonwalker: 0,
	doubloons: 0,
	taters: 0,
};

matchups.forEach(([home_team, away_team]) => {
	for (let i = 0; i < SIMULATIONS; i++) {
		let game = new Game({ home_team, away_team});
		let winner = game.play();
		wins[winner]++;
	}
});

let total = 4 * SIMULATIONS;
console.log('Moonwalker: ' + (wins.moonwalker / total * 100) + '%');
console.log('Doubloons: ' + (wins.doubloons / total * 100) + '%');
console.log('Taters: ' + (wins.taters / total * 100) + '%');

console.log('=======================\nIn A 162 Game Season...\n=======================');
console.log('Taters: ' + green(Math.round(wins.taters / total * 162)) + ' wins');
console.log('Moonwalker: ' + yellow(Math.round(wins.moonwalker / total * 162)) + ' wins');
console.log('Doubloons: ' + red(Math.round(wins.doubloons / total * 162)) + ' wins');
