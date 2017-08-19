import React, {Component} from 'react';

export default class App extends Component
{

    keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
    };

    state = {
        position: {
            x: window.outerWidth /2,
            y: window.outerHeight/2,
        },
        direction: -90,
        size: {
            width:50,
            height:50,
        },
        velocity: 0,
    };

    keyUp = (event) => {
        if (Object.keys(this.keys).includes(event.key)) {
            this.keys[event.key] = false;
        }
    }

    keyDown = (event) => {
        if (Object.keys(this.keys).includes(event.key)) {
            this.keys[event.key] = true;
        }
    }

    componentWillMount = () => {
        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);
    }

    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.keyDown);
        window.removeEventListener('keyup', this.keyUp);
        clearInterval(this.listener);
    }

    componentDidMount = () => {
        this.listener = setInterval(this.renderPosition, 100);
    }


    renderPosition = () => {
        let x = this.state.position.x;
        let y = this.state.position.y;
        let direction = this.state.direction;
        let velocity = this.state.velocity;

        const prevX = x;
        const prevY = y;

        const increment = 2;

        /**
         * decrement the velocity when no keys pressed
         */
        if (!this.keys.ArrowRight && !this.keys.ArrowDown && !this.keys.ArrowUp && !this.keys.ArrowLeft && velocity > 0) {
            velocity-=(increment*2);
            if (velocity < 0) {
                velocity = 0;
            }
        }

        /**
         * check keys pressed
         */
        if (this.keys.ArrowUp) {
            y-=velocity;
            velocity = (velocity >= 30) ? velocity : velocity+increment;
        } else if (this.keys.ArrowDown) {
            y+=velocity;
            velocity = (velocity >= 30) ? velocity : velocity+increment;
        }

        if (this.keys.ArrowLeft) {
            x-=velocity;
            velocity = (velocity >= 30) ? velocity : velocity+increment;
        } else if (this.keys.ArrowRight) {
            x+=velocity;
            velocity = (velocity >= 30) ? velocity : velocity+increment;
        }

        /**
         * Make sure we're still in the view port
         */
        //use with because of rotate
        if (y >= window.outerHeight - this.state.size.width) {
            y = prevY;
        } else if (y <= 0) {
            y = 0;
        }

        if (x >= window.outerWidth - this.state.size.width) {
            x = prevX;
        } else if (x <= 0) {
            x = 0;
        }

        /**
         * Do some directional math
         */
        if (prevY > y && prevX > x) {
            direction = -135;
        } else if (prevY < y && prevX < x) {
            direction = 45;
        } else if (prevY > y && prevX < x) {
            direction = -45;
        } else if (prevY < y && prevX > x) {
            direction = 135;
        } else if (prevY > y) {
            direction = -90;
        } else if (prevY < y) {
            direction = 90;
        } else if (prevX > x) {
            direction = 180;
        } else if (prevX < x) {
            direction = 0;
        }

        /**
         * only update if things change
         */
        if ((x !== prevX || prevY !== y) || velocity !== this.state.velocity) {
            this.setState({
                position: {
                    x: x,
                    y: y,
                },
                direction: direction,
                velocity: velocity,
            });
        }
    }

    render() {

        console.log(this.state);

        /**
         * Update styles
         * @type {{top: (*), left: (*), transform: string, width: number, height: number}}
         */
        const spaceShip = {
            top:this.state.position.y,
            left: this.state.position.x,
            transform: `rotate(${this.state.direction}deg)`,
            width: this.state.size.width,
            height: this.state.size.height,
        };

        return (
            <div className="game" onKeyDown={this.keyPress}>
                <div className="sprit fa fa-space-shuttle" style={spaceShip}>
                </div>
                <div className="dials">
                    Velocity: {this.state.velocity}<br/>
                    Direction: {this.state.direction}<br/>
                    Position: {`{x: ${this.state.position.x}, y: ${this.state.position.y}}`}
                </div>
            </div>
        );
    }
}