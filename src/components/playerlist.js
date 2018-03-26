import React from 'react';
import PlayerItem from './playeritem';

class PlayerList extends React.Component {

    render(){
        const players = this.props.players;
        const elements = [];
        players.forEach((player, i) => {
            elements.push(<PlayerItem key={player.stone} player={player} active={i === this.props.active} />);
        });
        return (
            <ul data-content="playerList">
                {elements}
            </ul>
        );
    }

}

export default PlayerList;
