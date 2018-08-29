/**
 * Assumes `window.React` global object exists.
 * Also this will only work in browsers that support ES6 features.
 */

const e = React.createElement;

const Board = (props = {}) => {
    let { hoops, playerAPosition, playerBPosition } = props;
    return e(
        'ul',
        { style: { display: 'flex' } },
        Array(hoops).fill().map((s, i) => {
            return e(
                'li',
                { style: { flex: '1', border: '1px solid black', borderRadius: '9999px' } },
                i === playerAPosition ? 'A' : i === playerBPosition ? 'B' : ' '
            );
        })
    );
};

class Game extends React.Component {
    constructor(props = {}) {
        super(props);

        let { hoops = 10 } = props;

        this.state = { hoops, time: 0, playerAPosition: 0, playerBPosition: hoops - 1 };

        this.moveGameOneStep = this.moveGameOneStep.bind(this);
    }

    moveGameOneStep() {
        if (this.state.playerAPosition < this.state.playerBPosition - 1) {
            this.setState(prevState => ({
                playerAPosition: prevState.playerAPosition + 1,
                playerBPosition: prevState.playerBPosition - 1,
            }));
        } else {
            return false;
        }
    }

    render() {
        // if (this.state.liked) {
        //     return 'You liked this.';
        // }

        return e(Board);
    }
}
