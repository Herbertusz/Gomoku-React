import React from 'react';

import Core from './core';

class GameCanvas extends React.Component {

    constructor(props){
        super(props);
        this.changeState = this.changeState.bind(this);

        this.state = {
            gameSection : null,      // jelenlegi játékszakasz ('init'|'play'|'end')
            grid : Array(props.options.gridSize_x * props.options.gridSize_y).fill(null),  // táblára rakott kövek
            winner : {
                playerID : null,     // játékos azonosító
                sequence : []        // kirakott sor (fieldID lista)
            }
        };
    }

    changeState(updatedProperty){
        const updateObj = {};
        Object.keys(updatedProperty).forEach(p => {
            if (p === 'grid'){
                const grid = this.state.grid.slice();
                grid[updatedProperty[p].fieldID] = updatedProperty[p].playerID;
                updateObj[p] = grid;
            }
            else if (p === 'currentPlayerID'){
                this.props.changeCurrentPlayer(updatedProperty[p]);
            }
            else {
                updateObj[p] = updatedProperty[p];
            }
        });
        this.setState(updateObj);
        Core.applyState(Object.assign({}, this.state));
    }

    componentDidMount(){
        Core.init(this.canvas, this.props, this.changeState);
        Core.applyState(Object.assign({}, this.state));
    }

    render(){
        return (
            <canvas ref={elem => (this.canvas = elem)} width={this.props.width} height={this.props.height} />
        );
    }

}

export default GameCanvas;
