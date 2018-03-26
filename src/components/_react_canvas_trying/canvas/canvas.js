import React from 'react';

import Line from './line';

const CanvasComponents = {Line};

class Canvas extends React.Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        const canvasRef = this.canvas;
        this.props.children.forEach(child => {
            CanvasComponents[child.type.name](canvasRef, child.props);
        });
    }

    render(){
        return (
            <canvas ref={elem => (this.canvas = elem)} width={this.props.width} height={this.props.height} />
        );
    }
}

export default Canvas;
