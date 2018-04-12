import React from 'react';

import Util from '../hd/hd.utility';

import StatusBar from './statusbar';
import PlayerList from './playerlist';
import MessageBox from './messagebox';
import GameCanvas from './canvas/gamecanvas';

class PlayArea extends React.Component {

    constructor(props){
        super(props);
        this.changeState = this.changeState.bind(this);

        this.state = {
            gameSection : 'init',                           // játékszakasz ('init'|'playing'|'end')
            currentPlayerID : props.options.firstPlayerID,  // jelenlegi játékos azonosítója
            stepNum : 0,                                    // eddigi lépések száma (lerakott kövek száma + 1)
            winnerID : null                                 // győztes játékos azonosítója
        };
    }

    changeState(property, value){
        if (property === 'gameSection' || property === 'winnerID'){
            this.setState({
                [property] : value
            });
        }
        else {
            this.setState(prevState => ({
                currentPlayerID : value,
                stepNum : prevState.stepNum + 1
            }));
        }
    }

    render(){
        const currentPlayerID = this.state.currentPlayerID;
        const options = this.props.options;

        const players = Util.Array.fromNum(options.playerNum).map(i => ({
            name : options.playerNames[i],
            ai : options.playerAIs[i],
            stone : options.playerStones[i],
            color : options.stoneColors[i]
        }));

        return (
            <React.Fragment>
                <div className="gamecontainer">
                    <StatusBar gameSection={this.state.gameSection} stepNum={this.state.stepNum}
                        currentPlayerID={currentPlayerID} players={players} />
                    <div className="gameplace">
                        <GameCanvas width="700" height="450" options={options}
                            currentPlayerID={currentPlayerID} changeState={this.changeState} />
                    </div>
                </div>
                <aside>
                    <div className="list">
                        <h2>Játékosok:</h2>
                        <PlayerList gameSection={this.state.gameSection} players={players} active={currentPlayerID} />
                    </div>
                    <MessageBox gameSection={this.state.gameSection} winnerID={this.state.winnerID}
                        playerNames={options.playerNames} active={currentPlayerID} />
                </aside>
            </React.Fragment>
        );
    }

}

export default PlayArea;
