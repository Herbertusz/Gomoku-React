import React from 'react';

import Canvas from './canvas/canvas';
import Line from './canvas/line';

/*
    options : {
        gridSize_x : 20,
        gridSize_y : 15,
        connectNum : 5,
        playerNum : 2,
        playerAIs : ['human', 'random', 'random'],
        playerNames : ['Hörb', 'Dan', 'Svarci'],
        playerStones : [0, 1, 2],
        stoneColors : ['rgb(255, 0, 0)', 'rgb(0, 150, 0)', 'rgb(0, 0, 255)'],
        firstPlayerID : 0,
        isValid : true
    },
    grid : [null, ...]
};
*/

class GameTable extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            gameSection : null,      // jelenlegi játékszakasz ('init'|'play'|'end')
            currentPlayerID : null,  // jelenlegi játékos azonosítója
            grid : [],               // táblára rakott kövek
            winner : {
                playerID : null,     // játékos azonosító
                sequence : []        // kirakott sor (fieldID lista)
            }
        };
    }

    render(){
        return (
            <div className="gameplace">
                {this.props.options.gridSize_x} x {this.props.options.gridSize_y}
                <Canvas width="700" height="450" {...this.props}>
                    <Line color="red" width="5" x1="100" y1="150" x2="300" y2="400" />
                    <Line color="blue" width="1" x1="200" y1="150" x2="300" y2="400" />
                </Canvas>
            </div>
        );
    }
}

export default GameTable;
