import React from 'react';

class MessageBox extends React.Component {

    constructor(props){
        super(props);
        this.newGame = this.newGame.bind(this);
    }

    newGame(){
        window.location.reload();
    }

    render(){
        const activePlayerName = this.props.playerNames[this.props.active];
        const isEnd = (this.props.gameSection === 'end');
        const drawEnd = <em>döntetlen</em>;
        return (
            <div className="messagebox">
                {isEnd ? (
                    <div className="message">Játék vége! Győztes: {this.props.playerNames[this.props.winnerID] || drawEnd}</div>
                ) : (
                    <div className="message">Várakozás {activePlayerName} játékos lépésére...</div>
                )}
                <a className="new-game" onClick={this.newGame}>Új játék</a>
            </div>
        );
    }

}

export default MessageBox;
