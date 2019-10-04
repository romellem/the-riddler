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

// const G = require('generatorics');

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
	constructor({ home_team, away_team }) {
		// Math is easier with 18 innings. Odd is 'top' (away bats), even is 'bottom' (home bats)
		this.inning = 1;
		this.home_team = home_team;
		this.away_team = away_team;

		this.home_score = 0;
		this.away_score = 0;

		this.outs;
		this.bases = [false, false, false];
	}

	halfInning() {
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

		while (this.outs < 3) {
			let at_bat = offense.bat();
			const { result } = at_bat;

			switch (result) {
				case 'out':
					this.outs++;
					break;

				case 'walk':
					// Wow this is convoluted...
					this.bases.unshift(true);

					if (this.bases[3] === true) {
						this[score_str]++;
					}

					this.bases.pop();
					break;

				case 'double':
					if (this.bases[1] === true) {
						this[score_str]++;
					}

					this.bases[1] = true;
					break;

				case 'home_run':
					this[score_str]++;
					break;
			}
		}
		
		this.bases = [false, false, false];
		this.inning++;
	}

	play() {
		for (let i = 0; i < 18; i++) {
			this.halfInning();
		}

		while (this.home_score === this.away_score) {
			this.halfInning();
			this.halfInning();
		}

		// Return winning teams name
		return this.home_score > this.away_score ? this.home_team.name : this.away_team.name;
	}
}

const moonwalker = new Team('moonwalker', 0.4, 0.6, { result: 'walk' });
const doubloons = new Team('doubloons', 0.2, 0.8, { result: 'double' });
const taters = new Team('taters', 0.1, 0.9, { result: 'home_run' });

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
const SIMULATIONS = 10000;

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
