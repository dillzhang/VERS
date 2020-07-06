import React, { Component } from 'react';

import "./Draggable.css";

class Draggable extends Component {
    constructor(props) {
        super(props);

        this.dragging = false;
        this.prevX = -1;
        this.prevY = -1;

        this.state = {
            top: 100,
            left: 100,
        }

        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    render() {
        const style = { top: this.state.top, left: this.state.left }
        return (
            <div className={`draggable ${this.props.visible ? "" : "hidden"}`} style={style}>
                <div className="draggable-header"
                    onMouseDown={this.handleMouseDown}
                >
                    <div className="close-app" onClick={this.props.closeCall}>X</div>
                    <div className="app-name">{this.props.appName}</div>
                </div>
                <div className="draggable-body">
                    {this.props.children}
                </div>
            </div>
        )
    }

    handleMouseDown = (e) => {
        console.log("down");

        this.dragging = true;
        this.prevX = e.clientX;
        this.prevY = e.clientY;
    }

    handleMouseMove = (e) => {
        if (!this.dragging) {
            return;
        }
        console.log("move");
        let newState = {
            left: this.state.left + e.clientX - this.prevX,
            top: this.state.top + e.clientY - this.prevY,
        }

        this.prevX = e.clientX;
        this.prevY = e.clientY;

        this.setState(newState);
    }

    handleMouseUp = (e) => {
        this.dragging = false;
    }
}

export default Draggable;