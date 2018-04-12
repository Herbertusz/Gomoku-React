import React from 'react';

import Options from './options';
import PlayArea from './playarea';

class Game extends React.Component {

    constructor(props){
        super(props);
        this.formChange = this.formChange.bind(this);
        this.setValid = this.setValid.bind(this);
        this.start = this.start.bind(this);

        this.numberState = ['gridSize_x', 'gridSize_y', 'connectNum', 'playerNum', 'playerStones', 'firstPlayerID'];
        this.state = {
            form : {
                gridSize_x : 20,
                gridSize_y : 15,
                connectNum : 5,
                playerNum : 3,
                playerAIs : ['human', 'random', 'random'],
                playerNames : ['Hörb', 'Dan', 'Svarci'],
                playerStones : [0, 1, 2],
                stoneColors : ['rgba(255, 0, 0, 1)', 'rgba(0, 150, 0, 1)', 'rgba(0, 0, 255, 1)'],
                lineColor : 'rgba(0, 0, 255, 1)',
                lineWidth : 1,  // TODO: valószínűleg Data.grid[].w és h módosítása kell ha beállítható
                firstPlayerID : 0,
                isValid : true
            },
            started : false
        };
    }

    formChange(name, value){
        const arrayRegexp = /^(.*?)\[(\d+?)]$/;
        if (arrayRegexp.test(name)){
            const [, arrayName, index] = arrayRegexp.exec(name);
            const newState = this.state.form[arrayName];
            newState[index] = value;
            this.setState({
                form : {
                    ...this.state.form,
                    [arrayName] : newState
                }
            });
        }
        else {
            this.setState({
                form : {
                    ...this.state.form,
                    [name] : value
                }
            });
        }
    }

    setValid(isValid){
        this.setState({isValid});
    }

    start(){
        this.setState({
            started : true
        });
    }

    render(){
        const options = this.state.form;
        const convert = (key, val) => ((this.numberState.indexOf(key) > -1) ? Number(val) : val);

        Object.keys(options).forEach(key => {
            if (typeof options[key] === 'string'){
                options[key] = convert(key, options[key]);
            }
        });

        const playAreaElement = this.state.started ? <PlayArea options={options} /> : '';

        return (
            <section className="game">
                <Options form={options} formChange={this.formChange} setValid={this.setValid}
                    start={this.start} started={this.state.started} />
                {playAreaElement}
                <div className="clearfix"></div>
            </section>
        );
    }

}

export default Game;
