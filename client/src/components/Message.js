import React, { Component } from 'react';

class Message extends Component {
  // Initialize the state
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className={`chat-messages ${this.props.viewer == this.props.sender ? "chat-sender": ""}` }>
          {this.props.viewer != this.props.sender && <><span>{this.props.sender}</span>:<br /></>}
          {this.props.content}
      </div>
    );
  }
}

export default Message;