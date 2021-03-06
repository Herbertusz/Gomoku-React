import React from 'react';

import Core from './core';

class GameCanvas extends React.Component {

    componentDidMount(){
        Core.init(this.canvas, this.props);
    }

    render(){
        return (
            <canvas ref={e => (this.canvas = e)} width={this.props.width} height={this.props.height} />
        );
    }

}

export default GameCanvas;
