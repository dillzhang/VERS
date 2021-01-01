import React, { Component } from "react";

import "./Email.css";

import emails from "../constants/emailThread";

class Email extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      chain: this.props.level,
      failed: this.props.failed,
    };

    this.props.socket.on("roomStateUpdate", ({ state, failed }) => {
      this.setState({ chain: state, failed });
      this.scrollToBottom();
    });
  }

  scrollToBottom = () => {
    this.threadHolder.scroll({
      top: this.threadHolder.scrollHeight,
      behavior: "smooth",
    });
  };

  render() {
    return (
      <div
        className="email"
        ref={(el) => {
          this.threadHolder = el;
        }}
      >
        <div className="subject">[URGENT]: Aliens are here!</div>
        {emails.map((thread, i) => {
          if (i <= this.state.chain - 70) {
            return (
              <div key={`thread-${i}`} className="thread">
                {thread(this.state.failed)}
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export default Email;
