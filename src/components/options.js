import React from 'react';

class Options extends React.Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            started : true,  // TODO
            errors : []
        };
    }

    handleSubmit(event){
        this.setState({
            started : true
        });
    }

    handleChange(event){
        let isValid = true;
        const name = event.target.name;
        const value = event.target.value;
        if (['gridSize_x', 'gridSize_y', 'connectNum'].indexOf(name) > -1 && !/^[0-9]*$/.test(value)){
            return;
        }
        if (name === 'connectNum'){
            if (value < 3 || value > Math.min(this.gridSize_x.value, this.gridSize_y.value)){
                this.setState({
                    errors : [...this.state.errors, name]
                });
                isValid = false;
            }
        }
        this.props.formChange(name, value);
        this.props.setValid(isValid);
    }

    render(){
        const form = this.props.form;
        return (
            <div id="game-overlay" className={this.state.started ? 'hidden' : ''}>
                <div className="form">
                    <div className="error">{String(this.state.errors)}</div>
                    <div className="label">
                        <span>Pálya mérete:</span>
                        <input type="text" name="gridSize_x" value={form.gridSize_x} ref={gridSize_x => (this.gridSize_x = gridSize_x)} onChange={this.handleChange} />
                        x
                        <input type="text" name="gridSize_y" value={form.gridSize_y} ref={gridSize_y => (this.gridSize_y = gridSize_y)} onChange={this.handleChange} />
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
                        <input type="radio" name="firstPlayerID" value="0" checked={form.firstPlayerID === 0} onChange={this.handleChange} />
                        <input type="radio" name="firstPlayerID" value="1" checked={form.firstPlayerID === 1} onChange={this.handleChange} />
                        <input type="radio" name="firstPlayerID" value="2" checked={form.firstPlayerID === 2} onChange={this.handleChange} />
                    </div>
                    <button id="start" disabled={!form.isValid} onClick={this.handleSubmit}>Start!</button>
                </div>
            </div>
        );
    }
}

export default Options;
