import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";
import ReactAudioPlayer from 'react-audio-player';

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
const baseProto = new URL(window.location.href).protocol;

const chatFiles = {
  backpack: <div className="backpack"><p>Backpack</p><ul><li>Thermal Camera</li><li>Mirror</li><li>Multi-tool</li></ul></div>,
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
  baby: <img src="/vault/baby.jpg" alt="Baby"/>,
  cameras: <img src="/vault/cameras.jpg" alt="Cameras"/>,
  powder: <img src="/vault/powder.jpg" alt="Powder"/>,

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
        chatColor: "#65fc31",
        activeSounds: [],
        soundsToRemove: [],
    }

    this.socket.on("joinRoomStatus", ({ state, password }) => {
        console.log("verified");
        this.setState({ 
          state,
          playerUrl: `${baseProto}//${baseURL}/player/${this.props.match.params.code}/${password}`,
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

    this.socket.on('reconnect', (_) => {
      this.socket.emit("rejoinRoom", { room: this.room, password: "HOST" });
    });
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.socket.emit("joinRoom", { room: this.room, password: "HOST" });
  }

  playSound = (name, className, source) => {
    var newSound = {
      name: name,
      class: className,
      source: source,
      time: Date.now()
    }
    this.setState(prevState => ({
      activeSounds: [...prevState.activeSounds, newSound]
    }))
  }

  render() {
    return (
      <div className="app host">
        <div className="sounds">
          {this.state.activeSounds.map((sound) => {
              return (
                <ReactAudioPlayer
                  key={sound.id}
                  className={sound.class}
                  src={sound.source}
                  autoPlay
                />);
            })
          }
        </div>
        <div className="header">
          <h1>Actor's Panel ({this.room})</h1>
          Player URL: {this.state.playerUrl && ( 
            <a href={this.state.playerUrl} target="_blank">
              {this.state.playerUrl}
            </a>)
          }
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
            {this.state.state >= 10 && <button onClick={() => {
              this.socket.emit("add-five-minutes", {roomCode: this.room});
              }}> Add 5 Minutes</button>}
            <Chat room={this.room} viewer="@lex" chatColor={this.state.chatColor} files={chatFiles} socket={this.socket} playSound={this.playSound}/>
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
        return ["Huh, so… I’ve been walking around for a while, and all I can see is this abandoned warehouse. Should I go in? I’ll send a picture over."];
      case 10:
      case 15:
        return ["I made it into the warehouse. It’s awful dark in here… and I don’t see anything suspicious?"];
      case 20:
        return ["Alright, I’m in the elevator and there are 5 buttons, ground through sublevel 4. Which should I press?"];
      case 30:
        return ["I see— (Suddenly switch to whispering.) Holy sh- this looks like the right floor. There’s a bunch of hallways with security cameras. I gotta lay low. Here’s what I’m seeing."];
      case 40:
      case 45:
        return ["Looks good to me. I’m sharing my location and streaming a video of the circuit breaker panel so you can monitor which sensors are active. Tell me when to go north, east, south, or west! Remember I can avoid the laser trip wires, but you need to warn me about them. I also won't be able to move as quickly."];
      case 50:
        return ["Whew, I made it to the vault door! I can’t believe it. We’re so close.", "Ok, the door’s locked with a keyboard. The screen’s asking for an ID number. Any idea what I should put in?"];
      case 60:
      case 65:
        return ["We’re in! Whoa.", "It’s a secret laboratory. It’s all dark and green. There are alien creatures in giant glass tubes? Yep, those are definitely alien. Look at this."];
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
              this.sendFile("backpack");
            }}>(1) Send Backpack Contents</button>
            <button onClick={() => {
              this.sendFile("warehouse");
            }}>(2) Send Warehouse Image</button>
            <button onClick={() => {
              this.socket.emit("start-time", {room: this.room});
            }} className="warning">(3) Start Timer</button>
          </div>
        )
      case 10:
      case 15:
        return(
          <div>
            <button onClick={() => {
              this.sendFile("no_thermal_warehouse");
            }}>(1) Send Dark Warehouse Image</button>
            <button onClick={() => {
              this.sendFile("thermal_warehouse");
            }}>(2) Send Thermal Warehouse Image (Power Off)</button>
            <button onClick={() => {
            this.socket.emit("setRoomState", {roomCode: this.room, state: 15});
          }} className="warning">(3) Flip Switch and Attach File System</button>
            <button onClick={() => {
              this.sendFile("thermal_warehouse_wires");
            }}>(4) Send Thermal Warehouse Image (Power On)</button>
            <button onClick={() => {
              this.socket.emit("setRoomState", {roomCode: this.room, state: 20});
            }} className="warning">(5) Move to Elevator</button>
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
      case 45:
            return <> 
              <button onClick={() => {
                this.socket.emit("setRoomState", {roomCode: this.room, state: 45});
                }}>(1) Send Live Stream </button>
              <ActorMoving socket={this.socket} room={this.room} />
            </>;
      case 50: 
            return <>
              <button onClick={() => {
                this.sendFile("vault_door");
              }}>(1) Send Vault Door Image</button>
              <VaultDoor socket={this.socket} room={this.room} /></>
      case 60:
      case 65:
        return <>
          <button onClick={() => {
            this.sendFile("tubes");
          }}>(1) Send Tubes</button>
          <button onClick={() => {
            this.sendFile("brain");
          }}>(2) Send Brain</button>
          <button onClick={() => {
            this.sendFile("computer");
          }}>(3) Send Computer</button>
          <button onClick={() => {
            this.sendFile("languageTranscript1");
          }} className="highlight">(4) Send Transcript 1</button>
          <button onClick={() => {
            this.sendFile("alienArticle");
          }} className="highlight">(5) Send Journal</button> 
          <button onClick={() => {
            this.socket.emit("setRoomState", {roomCode: this.room, state: 65});
          }} className="highlight">(6) Send Translator Application </button>
          <button onClick={() => {
            this.sendFile("languageTranscript2");
          }} className="highlight">(7) Send Transcript 2</button>
          <button onClick={() => {
            this.sendFile("cameras");
          }}>(8) Send Cameras</button>
          <button onClick={() => {
            this.sendFile("powder");
          }}>(9) Send Powder</button>
          <button onClick={() => {
            this.sendFile("subject1");
            this.sendFile("subject2");
          }}>(10) Send Subjects</button>
          <button onClick={() => {
            this.sendFile("baby");
          }}>(11) Send Baby</button>
          <button onClick={() => {
            this.socket.emit("setRoomState", {roomCode: this.room, state: 70});
          }} className="confirm">(12) Complete Mission</button>
        </>
      default:
        return "Something wrong has occurred";
    }
  }

  // Use this function to "send" files
  // content should be the id specified in Guest
  sendFile = (content) => {
    this.socket.emit("newFileMessage", {content, sender: "@lex", roomCode: this.room, color: this.state.chatColor });
    this.playSound("message-sent", "sound-message-sent", "/sounds/message-sent.ogg")
  }
}

export default Host;