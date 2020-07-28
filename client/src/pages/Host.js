import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";

import './Host.css'

import Chat from "../components/Chat";
import Timer from "../components/Timer";

const baseURL = new URL(window.location.href).host;

class Host extends Component {
  // Initialize the state
  constructor(props){
    super(props);

    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;

    this.state = {
        state: 0,
    }

    this.socket.on("roomStatus", (data) => {
        this.setState({ state: data });
    });
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.socket.emit("joinRoom", { room: this.room, password: "HOST" });
  }

  render() {
    return (
      <div className="app host">
        <div className="header">
          <h1>Actor for Room {this.room}</h1>
        </div>
        <div className="body">
          <div className="main">
            {this.renderMain()}
          </div>
          <div className="side-bar">
            <Timer socket={this.socket}/>
            <Chat room={this.room} viewer="@lex" socket={this.socket}/>
          </div>
        </div>
      </div>
    );
  }

  renderMain = () => {
    switch (this.state.state) {
      case 0:
        return(
          <div>
            <button onClick={() => {
              this.socket.emit("start-time", {room: this.room});
            }}>Start Timer</button>

            {/*Example Button for sending file1*/}
            <button onClick={() => {
              this.sendFile("file1");
            }}>Send File 1</button>
            
          </div>
        )
      default:
        return "Something wrong has occured";
    }
  }

  // Use this function to "send" files 
  // content should be the id specified in Guest
  sendFile = (content) => {
    this.socket.emit("newFileMessage", {content, sender: "@lex", roomCode: this.room});
  }
}

export default Host;