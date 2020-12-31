import React, { Component } from "react";

import "./Timer.css";

class Timer extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.socket = props.socket;

    this.socket.on("timer-update", ({ time }) => {
      this.setState({ time });
    });

    this.state = {
      time: "00:00",
    };
  }

  render() {
    if (this.props.host) {
      return (
        <>
          <div className="timer-box player-time">
            <h3>Player's Time</h3>
            <p>{this.state.time}</p>
          </div>
          <div className="timer-box actual-time">
            <h3>Actual Time</h3>
            <p>{this.state.time}</p>
          </div>
        </>
      );
    }
    return <div className="timer-box">{this.state.time}</div>;
  }
}

export default Timer;
