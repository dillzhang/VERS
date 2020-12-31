import React, { Component } from "react";

import "./Timer.css";

class Timer extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.socket = props.socket;

    this.socket.on("timer-update", ({ time, actualTime }) => {
      this.setState({ time, actualTime });
    });

    this.state = {
      time: "00:00",
      actualTime: "00:00",
    };
  }

  render() {
    if (this.props.host) {
      return (
        <>
          <div className="timer-box player-time">
            <h3>Player's</h3>
            <p>{this.state.time}</p>
          </div>
          <div className="timer-box actual-time">
            <h3>Actual</h3>
            <p>{this.state.actualTime}</p>
          </div>
        </>
      );
    }
    return (
      <div className="timer-box">
        <p>{this.state.time}</p>
      </div>
    );
  }
}

export default Timer;
