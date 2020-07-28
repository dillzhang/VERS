import React, { Component } from 'react';

class Message extends Component {
  // Initialize the state
  constructor(props){
    super(props);
  }

  render() {
    switch (this.props.type) {
      case "file":
        return (
          <div className={`chat-messages ${this.props.viewer == this.props.sender ? "chat-sender": ""}` }>
            {this.props.viewer != this.props.sender && <><span>{this.props.sender}</span>:<br /></>}
            <div className="file-container">
              {
                (this.props.files && this.props.files.hasOwnProperty(this.props.content)) ? 
                  this.props.files[this.props.content] : 
                  (<> File <span>{this.props.content}</span> not found </>)
              }
            </div>
          </div>
        )
      case "text":
        return (
          <div className={`chat-messages ${this.props.viewer == this.props.sender ? "chat-sender": ""}` }>
              {this.props.viewer != this.props.sender && <><span>{this.props.sender}</span>:<br /></>}
              {this.props.content}
          </div>
        );
    }
  }
}

export default Message;