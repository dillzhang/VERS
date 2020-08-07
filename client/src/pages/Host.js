import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";

import './Host.css'

import Chat from "../components/Chat";
import Timer from "../components/Timer";
import Elevator from  "../components/Elevator";

const baseURL = new URL(window.location.href).host;

class Host extends Component {
  // Initialize the state
  constructor(props){
    super(props);

    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;

    this.state = {
        state: 0,
        lines: [],
        chatColor: "#65fc31"
    }

    this.socket.on("joinRoomStatus", ({ state }) => {
        this.setState({ 
          state,
          lines: this.getLines(state),
        });
    });

    this.socket.on("roomStateUpdate", ({state}) => {
      console.log(state, this.getLines(state));
      this.setState({ 
        state,
        lines: this.getLines(state),
      });
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
          <h1>Actor's Panel ({this.room})</h1>
        </div>
        <div className="body">
          <div className="main">
            <div class="location">
              <h2>Location:</h2>
              <h2>{ this.getLocation() } ({this.state.state} / 80)</h2>
            </div>
            <div class="line-prompter">
              <h2>Line Prompter</h2>
              {this.state.lines.map((line, key) => (<p key={key}>{line}</p>))}
            </div>
            <div class="available-actions">
              <h2>Available Actions</h2>
            {this.renderMain()}
            </div>
          </div>
          <div className="side-bar">
            <Timer socket={this.socket}/>
            <Chat room={this.room} viewer="@lex" chatColor={this.state.chatColor} socket={this.socket}/>
          </div>
        </div>
      </div>
    );
  }

  getLocation = () => {
    if (this.state.state < 10) {
      return "Outside Warehouse";
    }
    else if (this.state.state < 20) {
      return "Warehouse";
    }
    else if (this.state.state < 30) {
      return "Elevator";
    }
    else if (this.state.state < 40) {
      return "Hallways Near Elevator";
    }
    else if (this.state.state < 50) {
      return "Hallways";
    }
    else if (this.state.state < 60) {
      return "Outside Alien Room";
    }
    else if (this.state.state < 70) {
      return "Inside Alien Room";
    }
    else if (this.state.state < 80) {
      return "Success";
    }
    else if (this.state.state < 90) {
      return "Failure";
    }
    return "Unknown";
  }

  getLines = (state) => {
    switch (state) {
      case 0:
        return ["It's dark in here... from what I can see it looks like any ordinary warehouse?"];
      case 10:
        return ["I'm enter the facility. I think I tripped an alarm. The average response time is about an hour. You can use the timer application to keep track."];
      case 20:
        return ["It's dark in here... from what I can see it looks like any ordinary warehouse?"];
      case 30:
        return [];
      case 40:
        return [];
      case 50:
        return [];
      case 60:
        return [];
      case 70:
        return [];
      case 80:
        return [];
      default:
        return ["Something wrong has occured"];
    }
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
            {/* <button onClick={() => {
              this.sendFile("file1");
            }}>Send File 1</button> */}

          </div>
        )
      case 10:
        return(
          <div>
            <button onClick={() => {
              this.sendFile("no_thermal_warehouse");
            }}>Send Dark Warehouse Image</button>
            <button onClick={() => {
              this.sendFile("thermal_warehouse");
            }}>Send Thermal Warehouse Image (Power Off)</button>
            <button onClick={() => {
              this.sendFile("thermal_warehouse_wires");
            }}>Send Thermal Warehouse Image (Power On)</button>
            <button onClick={() => {
              this.socket.emit("setRoomState", {roomCode: this.room, state: 20});
            }}>Move to Elevator</button>
          </div>
        )
      case 20:
        return(
          <div>
            <Elevator successCallback={() => {
              this.socket.emit("setRoomState", {roomCode: this.room, state: 30});
            }}/>
          </div>
        )
      default:
        return "Something wrong has occured";
    }
  }

  // Use this function to "send" files
  // content should be the id specified in Guest
  sendFile = (content) => {
    this.socket.emit("newFileMessage", {content, sender: "@lex", roomCode: this.room, color: this.state.chatColor });
  }
}

export default Host;