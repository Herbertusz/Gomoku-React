import React from 'react';

class MessageBox extends React.Component {

    render(){
        const activePlayerName = this.props.playerNames[this.props.active];
        return (
            <div className="messagebox">
                <div className="message">
                    Várakozás {activePlayerName} játékos lépésére...
                </div>
            </div>
        );
    }

}

export default MessageBox;
