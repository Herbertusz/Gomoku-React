import React from 'react';

import Timer from '../hd/hd.datetime.timer';

class StatusBar extends React.Component {

    constructor(props){
        super(props);
        this.tick = this.tick.bind(this);

        this.state = {
            time : '0:00'
        };
    }

    componentDidMount(){
        const timer = Timer(1);
        timer.start(() => {
            this.tick(timer.get('M:ss'));
        });
        this.timer = timer;
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
        const currentPlayerName = this.props.players[this.props.currentPlayerID].name;

        return (
            <div className="statusbar">
                <div className="status">
                    Lépés: <span>{currentPlayerName}</span>
                </div>
                <div className="status">
                    Idő: <span>{this.state.time}</span>
                </div>
                <div className="status">
                    Lépések száma: <span>{this.props.stepNum - 1}</span>
                </div>
                <div className="loader hidden"></div>
                <div className="clearfix"></div>
            </div>
        );
    }

}

export default StatusBar;
