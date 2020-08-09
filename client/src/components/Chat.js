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

  handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.newTextMessage();
    }
  }

  newTextMessage = () => {
    const content = this.state.message;
    const sender = this.viewer;
    if (content.length <= 0) {
      return;
    }
    this.socket.emit("newTextMessage", {content, sender, roomCode: this.room, color: this.props.chatColor});
    this.setState({message: ""});
  }

  updateMessage = (e) => {
    const value = e.target.value;
    this.setState({message: value});
  }

  scrollToBottom = () => {
    this.messageHolder.scroll({top: this.messageHolder.scrollHeight, behavior: "smooth"});
  }
  
  componentDidMount() {
    this.socket.emit("getTextMessage", {roomCode: this.room});
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div className="chat-box">
        <div className="chat-message-holder"
          ref={(el) => { this.messageHolder = el; }}>
          {this.state.messages.map(m => {
            return <Message key={m.time} {...m} viewer={this.viewer} files={this.props.files}/>
          })}
        </div>
        <div className="chat-form">
          <input type="text" placeholder="Type your message here" value={this.state.message} onChange={this.updateMessage} onKeyPress={this.handleKeyPress}></input>
          <button className="send-button" onClick={this.newTextMessage}>
            <img src="/desktop/send.svg" />
          </button>
        </div>
      </div>
    );
  }
}

export default Chat;