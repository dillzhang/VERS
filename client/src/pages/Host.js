import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";

import './Host.css'

import Chat from "../components/Chat";
import Timer from "../components/Timer";
import Elevator from  "../components/Elevator";
import ActorMoving from "../components/ActorMoving";
import VaultDoor from "../components/VaultDoor";

import warehouse_1dark_preview from "../warehouse_images/warehouse-1dark-preview.jpg";
import warehouse_2thermal_preview from "../warehouse_images/warehouse-2thermal-preview.jpg";
import warehouse_3powered_preview from "../warehouse_images/warehouse-3powered-preview.jpg";

const baseURL = new URL(window.location.href).host;

const chatFiles = {
  warehouse: <img src="/warehouse.jpg" alt="Warehouse exterior"/>,
  floor_plan_4: <div className="file"><strong>Floor Plan 4.bp</strong></div>,

  no_thermal_warehouse: <img src={warehouse_1dark_preview} alt="Warehouse"/>,

  thermal_warehouse: <img src={warehouse_2thermal_preview} alt="Warehouse (thermal)"/>,

  thermal_warehouse_wires: <img src={warehouse_3powered_preview} alt="Warehouse (thermal, power on)"/>,

  elevator_landing: <img src="/hallways/hallway.jpg" alt="Hallways outside elevator"/>,
  vault_door: <img src="/vault/door.jpg" alt="Vault door"/>,

  tubes: <img src="/vault/tubes.jpg" alt="Tubes"/>,
  brain: <img src="/vault/brain.jpg" alt="Brain"/>,
  subject1: <img src="/vault/subject1.jpg" alt="Subject"/>,
  subject2: <img src="/vault/subject2.jpg" alt="Subject"/>,
  computer: <img src="/vault/computer.jpg" alt="Computer"/>,

  languageTranscript1: <div className="file"><p><img className="icon" src="/desktop/file.svg" alt="File icon"/>transcript_20160103.pdf</p></div>,
  languageTranscript2: <div className="file"><p><img className="icon" src="/desktop/file.svg" alt="File icon"/>transcript_20160521.pdf</p></div>,
  alienArticle: <div className="file"><p><img className="icon" src="/desktop/file.svg" alt="File icon"/>journal_20151113.pdf</p></div>,
}

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
      this.setState({ 
        state,
        lines: this.getLines(state),
      });
    });

    this.socket.on("floor-plan-wrong", ({line}) => {
      this.setState({ 
        lines: [line],
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
            <div className="location">
              <h2>Location:</h2>
              <h2>{ this.getLocation() } ({this.state.state} / 80)</h2>
            </div>
            <div className="line-prompter">
              <h2>Line Prompter</h2>
              {this.state.lines.map((line, key) => (<p key={key}>{line}</p>))}
            </div>
            <div className="available-actions">
              <h2>Available Actions</h2>
            <div className="actions">
              {this.renderMain()}
            </div>
            </div>
          </div>
          <div className="side-bar">
            <Timer socket={this.socket}/>
            <Chat room={this.room} viewer="@lex" chatColor={this.state.chatColor} files={chatFiles} socket={this.socket}/>
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
      return "Hallways By Elevator";
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
        return ["Huh, these should be the right coordinates… all I can see around here is this warehouse. It looks abandoned… should I try to go in? Here, I’ll send a picture over."];
      case 10:
        return ["I’m in the warehouse! It’s dark in here… from what I can see it looks like any ordinary warehouse. Here, I’ll send a picture. I swear to God, you guys, this must be the right place... The past 4 years were not for nothing..."];
      case 20:
        return ["Alright, I’m in the elevator and there are 5 floor buttons, 1 through 5. Which do you think is the right floor?"];
      case 30:
        return ["I see— (suddenly switch to whispering.) Holy sh.. This looks like the right floor. There’s a bunch of hallways with security cameras. I gotta lay low. Here’s what I’m seeing."];
      case 40:
        return ["(whispering.) This looks good to me. I’m sharing my location and setting up a video stream of the circuit breaker panel so you can monitor the sensors. Can you guide me through the hallways? I’ve got a mirror to deflect lasers, so don’t worry about the laser trip wires."];
      case 50:
        return ["(out of breath.) Whew, I made it to the vault door! I can’t believe it.", "We’re so close. There’s a keypad lock on the door. The screen is asking for an ID number and passcode. Do you have any idea what I should put in?"];
      case 60:
        return ["We’re in! Whoa.", "Holy shit. It’s a secret laboratory? It’s all dark and green in here. There are alien creatures in here in giant glass tubes. Yep, those are definitely alien. Look at this."];
      case 70:
        return [""];
      case 80:
        return [""];
      default:
        return ["No lines found"];
    }
  }

  renderMain = () => {
    switch (this.state.state) {
      case 0:
        return(
          <div>
            <button onClick={() => {
              this.sendFile("warehouse");
            }}>(1) Send Warehouse Image</button>
            <button onClick={() => {
              this.socket.emit("start-time", {room: this.room});
            }} className="warning">(2) Start Timer</button>
          </div>
        )
      case 10:
        return(
          <div>
            <button onClick={() => {
              this.sendFile("no_thermal_warehouse");
            }}>(1) Send Dark Warehouse Image</button>
            <button onClick={() => {
              this.sendFile("thermal_warehouse");
            }}>(2) Send Thermal Warehouse Image (Power Off)</button>
            <button onClick={() => {
              this.sendFile("thermal_warehouse_wires");
            }}>(3) Send Thermal Warehouse Image (Power On)</button>
            <button onClick={() => {
              this.socket.emit("setRoomState", {roomCode: this.room, state: 20});
            }} className="warning">(4) Move to Elevator</button>
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
      case 30:
        return <button onClick={() => {
          this.sendFile("elevator_landing");
        }}>(1) Send Hallway Image</button>;
      case 40:
            return <ActorMoving socket={this.socket} room={this.room} />;
      case 50: 
            return <>
              <button onClick={() => {
                this.sendFile("vault_door");
              }}>(1) Send Vault Door Image</button>
              <VaultDoor socket={this.socket} room={this.room} /></>
      case 60:
        return <>
          <button onClick={() => {
            this.sendFile("tubes");
          }}>(1) Send Tubes</button>
          <button onClick={() => {
            this.sendFile("brain");
          }}>(2) Send Brain</button>
          <button onClick={() => {
            this.sendFile("subject1");
            this.sendFile("subject2");
          }}>(3) Send Subjects</button>
          <button onClick={() => {
            this.sendFile("computer");
          }}>(4) Send Computer</button>
          <button onClick={() => {
            this.sendFile("languageTranscript1");
          }}>(5) Send Transcript 1</button>
          <button onClick={() => {
            this.sendFile("languageTranscript2");
          }}>(6) Send Transcript 2</button>
          <button onClick={() => {
            this.sendFile("alienArticle");
          }}>(7) Send Journal</button> 
          <button onClick={() => {
            this.socket.emit("setRoomState", {roomCode: this.room, state: 70});
          }} className="warning">(8) Complete Mission</button>
        </>
      default:
        return "Something wrong has occurred";
    }
  }

  // Use this function to "send" files
  // content should be the id specified in Guest
  sendFile = (content) => {
    this.socket.emit("newFileMessage", {content, sender: "@lex", roomCode: this.room, color: this.state.chatColor });
  }
}

export default Host;