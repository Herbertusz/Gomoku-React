// import React from 'react';

const Line = function(canvas, props){
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = props.color;
    ctx.lineWidth = props.width;
    ctx.beginPath();
    ctx.moveTo(props.x1, props.y1);
    ctx.lineTo(props.x2, props.y2);
    ctx.stroke();
};

export default Line;
