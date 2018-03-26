import React from 'react';

import StatusBar from './statusbar';
import PlayerList from './playerlist';
import MessageBox from './messagebox';
import GameCanvas from './canvas/gamecanvas';

class PlayArea extends React.Component {
    constructor(props){
        super(props);
        this.changeCurrentPlayer = this.changeCurrentPlayer.bind(this);

        this.state = {
            currentPlayerID : props.options.firstPlayerID,  // jelenlegi játékos azonosítója
            stepNum : 0                                     // eddigi lépések száma (lerakott kövek száma + 1)
        };
    }

    changeCurrentPlayer(playerID){
        this.setState(prevState => ({
            currentPlayerID : playerID,
            stepNum : prevState.stepNum + 1
        }));
    }

    render(){
        const currentPlayerID = this.state.currentPlayerID;
        const players = [];
        const options = this.props.options;

        options.playerNames.forEach((name, i) => {
            const ai = options.playerAIs[i];
            const stone = options.playerStones[i];
            const color = options.stoneColors[i];
            players.push({name, ai, stone, color});
        });

        return (
            <React.Fragment>
                <div className="gamecontainer">
                    <StatusBar stepNum={this.state.stepNum} currentPlayerID={currentPlayerID} players={players} />
                    <div className="gameplace">
                        <GameCanvas width="700" height="450" options={options}
                            currentPlayerID={currentPlayerID} changeCurrentPlayer={this.changeCurrentPlayer} />
                    </div>
                </div>
                <aside>
                    <div className="list">
                        <h2>Játékosok:</h2>
                        <PlayerList players={players} active={currentPlayerID} />
                    </div>
                    <MessageBox playerNames={options.playerNames} active={currentPlayerID} />
                </aside>
            </React.Fragment>
        );
    }
}

export default PlayArea;
