import React, { Component } from 'react';

import "./Timer.css";

class Timer extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.socket = props.socket;

    this.state = {
        time: "38:41",
    }
  }

  render() {
    return (
      <div className="timer-box">
          {this.state.time}
      </div>
    );
  }
}

export default Timer;