import React from 'react';

class MessageBox extends React.Component {

    render(){
        const activePlayerName = this.props.playerNames[this.props.active];
        const isEnd = (this.props.gameSection === 'end');
        const drawEnd = <em>döntetlen</em>;
        return (
            <div className="messagebox">
                {isEnd ? (
                    <div className="message">Győztes: {this.props.playerNames[this.props.winnerID] || drawEnd}</div>
                ) : (
                    <div className="message">Várakozás {activePlayerName} játékos lépésére...</div>
                )}
            </div>
        );
    }

}

export default MessageBox;
