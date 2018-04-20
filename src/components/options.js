import React from 'react';

class Options extends React.Component {

    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkErrors = this.checkErrors.bind(this);

        this.element = {};
        this.state = {
            isValid : true,
            errors : []
        };
    }

    handleSubmit(event){
        this.props.start();
    }

    handleChange(event){
        let isValid = true;
        const name = event.target.name;
        const value = event.target.value;
        if (['gridSize_x', 'gridSize_y', 'connectNum'].includes(name) && !/^[0-9]*$/.test(value)){
            return;
        }
        this.props.formChange(name, value, () => {
            isValid = this.checkErrors();
            this.setState({isValid});
        });
    }

    checkErrors(){
        let isValid = true;
        const errors = [];
        const conditions = (form) => ({
            'gridSize_x' : (form.gridSize_x <= 30 && form.gridSize_x >= 3 && form.gridSize_x >= form.connectNum),
            'gridSize_y' : (form.gridSize_y <= 20 && form.gridSize_y >= 3 && form.gridSize_y >= form.connectNum),
            'connectNum' : (form.connectNum >= 3 && form.connectNum <= Math.min(form.gridSize_x, form.gridSize_y)),
            'playerNum' : (form.playerNum >= 2 && form.playerNum <= 3),
            'playerAIs' : form.playerAIs.every(ai => ai === 'human' || ai === 'random'),
            'playerNames' : form.playerNames.every(name => name.length > 0),
            'playerStones' : (
                form.playerStones.every(stone => [0, 1, 2].includes(Number(stone))) &&
                (new Set(form.playerStones.map(Number))).size === 3
            ),
            'firstPlayerID' : [0, 1, 2].includes(Number(form.firstPlayerID))
        });
        const validationData = conditions(this.props.form);
        Object.keys(validationData).forEach(elementName => {
            if (!validationData[elementName]){
                isValid = false;
                errors.push(elementName);
            }
        });
        this.setState({errors});
        return isValid;
    }

    render(){
        let errorMessage = '';
        const form = this.props.form;
        const errorMessages = {
            'gridSize_x' : 'Pálya szélessége max 30, min 3 kell legyen, és nem lehet kisebb nyeréshez szükséges hossznál!',
            'gridSize_y' : 'Pálya szélessége max 20, min 3 kell legyen, és nem lehet kisebb nyeréshez szükséges hossznál!',
            'connectNum' : 'Nyeréshez szükséges hossz min 3, és nem lehet nagyobb a pálya szélességénél és magasságánál!',
            'playerNum' : 'Játékosok száma 2 vagy 3 lehet.',
            'playerAIs' : 'Az algoritmus "human" vagy "random" lehet.',
            'playerNames' : 'A játékosok neve kötelező!',
            'playerStones' : 'A játékosok jele 0, 1, 2 lehet, és nem lehet azonos.',
            'firstPlayerID' : 'A kezdő játékos 0, 1, 2 lehet.'
        };
        this.state.errors.forEach(field => {
            errorMessage += `${errorMessages[field]}<br />`;
        });
        return (
            <div id="game-overlay" className={this.props.started ? 'hidden' : ''}>
                <div className="form">
                    <div className="error" dangerouslySetInnerHTML={{__html : errorMessage}}></div>
                    <div className="label">
                        <span>Pálya mérete:</span>
                        <input type="text" name="gridSize_x" value={form.gridSize_x} onChange={this.handleChange} />
                        x
                        <input type="text" name="gridSize_y" value={form.gridSize_y} onChange={this.handleChange} />
                    </div>
                    <div className="label">
                        <span>Nyeréshez szükséges sor/oszlop/átló hossza:</span>
                        <input type="text" name="connectNum" value={form.connectNum} onChange={this.handleChange} />
                    </div>
                    <div className="label">
                        <span>Játékosok száma:</span>
                        <select name="playerNum" value={form.playerNum} onChange={this.handleChange}>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div className="label">
                        <span>Játékosok algoritmusa:</span>
                        <select name="playerAIs[0]" value={form.playerAIs[0]} onChange={this.handleChange}>
                            <option value="human">human</option>
                            <option value="random">random</option>
                        </select>
                        <select name="playerAIs[1]" value={form.playerAIs[1]} onChange={this.handleChange}>
                            <option value="human">human</option>
                            <option value="random">random</option>
                        </select>
                        <select name="playerAIs[2]" value={form.playerAIs[2]} onChange={this.handleChange}>
                            <option value="human">human</option>
                            <option value="random">random</option>
                        </select>
                    </div>
                    <div className="label">
                        <span>Játékosok neve:</span>
                        <input type="text" name="playerNames[0]" value={form.playerNames[0]} onChange={this.handleChange} placeholder="Saját név" />
                        <input type="text" name="playerNames[1]" value={form.playerNames[1]} onChange={this.handleChange} />
                        <input type="text" name="playerNames[2]" value={form.playerNames[2]} onChange={this.handleChange} />
                    </div>
                    <div className="label">
                        <span>Játékosok jele:</span>
                        <input type="text" name="playerStones[0]" value={form.playerStones[0]} onChange={this.handleChange} />
                        <input type="text" name="playerStones[1]" value={form.playerStones[1]} onChange={this.handleChange} />
                        <input type="text" name="playerStones[2]" value={form.playerStones[2]} onChange={this.handleChange} />
                    </div>
                    <div className="label">
                        <span>Játékosok színei:</span>
                        <input type="text" name="stoneColors[0]" value={form.stoneColors[0]} onChange={this.handleChange} />
                        <input type="text" name="stoneColors[1]" value={form.stoneColors[1]} onChange={this.handleChange} />
                        <input type="text" name="stoneColors[2]" value={form.stoneColors[2]} onChange={this.handleChange} />
                    </div>
                    <div className="label">
                        <span>Vonalak színe:</span>
                        <input type="text" name="lineColor" value={form.lineColor} onChange={this.handleChange} />
                    </div>
                    <div className="label">
                        <span>Kezdő játékos:</span>
                        <label>
                            <input type="radio" name="firstPlayerID" value="0" checked={form.firstPlayerID === 0} onChange={this.handleChange} />
                            {this.props.form.playerNames[0]}
                        </label>
                        <label>
                            <input type="radio" name="firstPlayerID" value="1" checked={form.firstPlayerID === 1} onChange={this.handleChange} />
                            {this.props.form.playerNames[1]}
                        </label>
                        <label>
                            <input type="radio" name="firstPlayerID" value="2" checked={form.firstPlayerID === 2} onChange={this.handleChange} />
                            {this.props.form.playerNames[2]}
                        </label>
                    </div>
                    <button id="start" disabled={!this.state.isValid} onClick={this.handleSubmit}>Start!</button>
                </div>
            </div>
        );
    }

}

export default Options;
