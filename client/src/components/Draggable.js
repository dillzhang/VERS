import React, { Component } from 'react';

import "./Draggable.css";

class Draggable extends Component {
    constructor(props) {
        super(props);

        this.dragging = false;
        this.prevX = -1;
        this.prevY = -1;

        this.state = {
            top: 50 + (this.props.offset % 5) * 10,
            left: 200 + (this.props.offset % 10) * 40,
        }

        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    render() {
        const style = {
            top: Math.max(0, this.state.top),
            left: Math.max(0, this.state.left),
            zIndex: this.props.zIndex,
        };
        return (
            <>
                {(this.props.alwaysVisible || this.props.visible) && (
                    <div
                        className={`draggable ${this.props.visible ? "" : "hidden"}`}
                        style={style}
                    >
                        <div className="draggable-header">
                            <div className="close-app" onClick={this.props.closeCall}>✖</div>
                            <div className="app-name" onMouseDown={this.handleMouseDown}>{this.props.appName}</div>
                            <div className="app-name" onMouseDown={this.handleMouseDown} />
                        </div>
                        <div
                            className="draggable-body"
                            onMouseDown={this.props.topCall}
                            style={{ overflow: this.props.overflowHidden ? 'hidden' : 'auto' }}
                        >
                            {this.props.children}
                        </div>
                    </div>
                )}
            </>)
    }

    handleMouseDown = (e) => {
        this.props.topCall();
        this.dragging = true;
        this.prevX = e.clientX;
        this.prevY = e.clientY;
    }

    handleMouseMove = (e) => {
        if (!this.dragging) {
            return;
        }
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