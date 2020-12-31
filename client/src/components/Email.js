import React, { Component } from "react";

import "./Email.css";

import emails from "../constants/emailThread";

class Email extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      chain: 4,
    };

    this.props.socket.on("emailUpdate", ({ chain }) => {
      this.setState({ chain });
    });
  }

  render() {
    return (
      <div className="email">
        <div className="subject">[URGENT]: Aliens are here!</div>
        {emails.map((thread, i) => {
          console.log(i, this.state.chain);
          if (i <= this.state.chain) {
            return (
              <div key={`thread-${i}`} className="thread">
                {thread}
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export default Email;
