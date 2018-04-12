import React from 'react';

import Timer from '../hd/hd.datetime.timer';

class PlayerItem extends React.Component {

    constructor(props){
        super(props);
        this.tick = this.tick.bind(this);

        this.timer = Timer(1);
        this.state = {
            time : '0:00'
        };
    }

    componentDidUpdate(){
        // a renderben nem jó ha változik a state
        if (this.props.active){
            this.timer.start(() => {
                this.tick(this.timer.get('M:ss'));
            });
        }
        else {
            this.timer.pause();
        }
    }

    shouldComponentUpdate(){
        if (this.props.gameSection === 'end'){
            this.timer.stop();
            return false;
        }
        return true;
    }

    tick(formattedTime){
        this.setState({
            time : formattedTime
        });
    }

    render(){
        const player = this.props.player;
        return (
            <li className={`bar ${this.props.active ? 'active' : ''}`}>
                <div className="color" style={{backgroundColor : player.color}}></div>
                <span data-content="playerName" data-player={player.stone}>{player.name}</span>
                <div className="time" data-content="playerTime" data-player={player.stone}>{this.state.time}</div>
            </li>
        );
    }

}

export default PlayerItem;
