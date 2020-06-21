import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";

import Chat from "../components/Chat";

const baseURL = new URL(window.location.href).host;

class Guest extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;

    this.state = {
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.socket.emit("joinRoom", this.room);
  }

  render() {
    return (
      <div className="App">
        <h1>Player for Room {this.room}</h1>

        <Chat room={this.room} viewer="guest" socket={this.socket}/>
      </div>
    );
  }
}

export default Guest;