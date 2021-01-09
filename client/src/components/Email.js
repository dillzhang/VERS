import React, { Component } from "react";

import "./Email.css";

import successEmails from "../constants/emailThreadSuccess";
import failureEmails from "../constants/emailThreadFailure";

class Email extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      chain: this.props.level,
      failed: this.props.failed,
      emails: this.props.failed ? failureEmails : successEmails,
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
        <div className="subject">{ this.state.failed ? "captured by FBI" : "[URGENT]: Aliens are here! with PROOF" }</div>
        {this.state.emails.map((thread, i) => {
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
