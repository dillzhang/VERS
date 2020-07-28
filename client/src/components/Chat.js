import React, { Component } from 'react';

import './Chat.css';

import Message from "./Message";

class Chat extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.room = props.room;
    this.viewer = props.viewer;
    this.socket = props.socket;

    this.state = {
      messages: [],
      message: "",
    }

    this.scrolled = false;

    this.socket.on("messageStatus", (data) => {
      this.setState({messages: data});
    })

    console.log(this.props.files)
  }

  newTextMessage = () => {
    const content = this.state.message;
    const sender = this.viewer;
    if (content.length <= 0) {
      return;
    }
    this.socket.emit("newTextMessage", {content, sender, roomCode: this.room});
    this.setState({message: ""});
  }

  updateMessage = (e) => {
    const value = e.target.value;
    this.setState({message: value});
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
    this.socket.emit("getTextMessage", {roomCode: this.room});
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div className="chat-box">
        <div className="chat-message-holder">
          {this.state.messages.map(m => {
            return <Message key={m.time} {...m} viewer={this.viewer} files={this.props.files}/>
          })}
          <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
        <div className="chat-form">
          <input type="text" value={this.state.message} onChange={this.updateMessage}></input>
          <button onClick={this.newTextMessage}>Send</button>
        </div>
      </div>
    );
  }
}

export default Chat;