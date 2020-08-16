import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";

import Chat from "../components/Chat";
import Draggable from "../components/Draggable";
import FileSystem from "../components/FileSystem";
import VideoStream from "../components/VideoStream"
import Timer from "../components/Timer";
import Panorama from '../components/Panorama';
import Translator from '../components/Translator';

import './Guest.css'

import alienArticle from "../fileSystem/AlienArticle";
import directory from "../fileSystem/Directory";
import FloorPlan from "../fileSystem/FloorPlan";
import guard1 from "../fileSystem/Guard1";
import guard2 from "../fileSystem/Guard2";
import languageTranscript1 from "../fileSystem/LanguageTranscript1";
import languageTranscript2 from "../fileSystem/LanguageTranscript2";
import securityManual from "../fileSystem/SecurityManual";

import warehouse_1dark_preview from "../warehouse_images/warehouse-1dark-preview.jpg";
import warehouse_2thermal_preview from "../warehouse_images/warehouse-2thermal-preview.jpg";
import warehouse_3powered_preview from "../warehouse_images/warehouse-3powered-preview.jpg";

import warehouse_1dark from "../warehouse_images/warehouse-1dark.jpg";
import warehouse_2thermal from "../warehouse_images/warehouse-2thermal.jpg";
import warehouse_3powered from "../warehouse_images/warehouse-3powered.jpg";

const baseURL = new URL(window.location.href).host;
const chatColors = ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b", "#577590", "#75B9BE", "#A8CCC9", "#B3D6C6", "#DCEAB2", "#C7D66D", "#FCD0A1", "#B1B695", "#53917E", "#63535B", "#6D1A36"];

const STATE_SUCCESS = 70
const STATE_FAILURE = 80

const stateApplications = {
  0: ["secureChat"],  // 0
  10: ["timer"],  // 10
  15: ["fileSystem"],  //15
  20: [],  // 20
  30: [],  // 30
  40: ["videoStream"],  // 40
  50: [],  // 50
  60: ["translator"],  // 60
  70: [],  // 70
  80: [],  // 80
}

class Guest extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;
    this.homeRef = React.createRef();

    this.state = {
      state: -1,

      username: "",  // Delete after testing
      password: "",  // Delete after testing
      unlocking: false,

      chatColor: chatColors[Math.floor(Math.random() * chatColors.length)],

      currentTime: "00:00:00",
      applicationsOpen: [],
    }

    // Clock
    setInterval(() => {
      const today = new Date();
      const time = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);
      this.setState({ currentTime: time });
    }, 499);

  this.socket.on("roomStateUpdate", ({state}) => {
    this.setState(prev => ({
      state,
      applicationsOpen: [...prev.applicationsOpen, ...stateApplications[state].filter(s => prev.applicationsOpen.indexOf(s) === -1)],
      error: "",
    }));
  });

  this.socket.on("joinRoomStatus", ({state}) => {
    // Chat Short Cuts
    this.chatFiles = {
      warehouse: <img onClick={() => {this.openApplication("warehouse")}} src="/warehouse.jpg" alt="Warehouse exterior"/>,
      floor_plan_4: <div className="file"><p><img className="icon" src="/desktop/file.svg" alt="File icon"/> floor4.bp</p></div>,

      no_thermal_warehouse: <img onClick={() => {this.openApplication("no_thermal_warehouse")}} src={warehouse_1dark_preview} alt="Warehouse"/>,

      thermal_warehouse: <img onClick={() => {this.openApplication("thermal_warehouse")}} src={warehouse_2thermal_preview} alt="Warehouse (thermal)"/>,

      thermal_warehouse_wires: <img onClick={() => {this.openApplication("thermal_warehouse_wires")}} src={warehouse_3powered_preview} alt="Warehouse (thermal, power on)"/>,

      elevator_landing: <img  onClick={() => {this.openApplication("elevator_landing")}} src="/hallways/hallway.jpg" alt="Hallways outside elevator"/>,
      vault_door: <img  onClick={() => {this.openApplication("vault_door")}} src="/vault/door.jpg" alt="Vault door" />,

      tubes: <img onClick={() => {this.openApplication("tubes")}} src="/vault/tubes.jpg" alt="Tubes"/>,
      brain: <img onClick={() => {this.openApplication("brain")}} src="/vault/brain.jpg" alt="Brain"/>,
      subject1: <img onClick={() => {this.openApplication("subject1")}} src="/vault/subject1.jpg" alt="Subject"/>,
      subject2: <img onClick={() => {this.openApplication("subject2")}} src="/vault/subject2.jpg" alt="Subject"/>,
      computer: <img onClick={() => {this.openApplication("computer")}} src="/vault/computer.jpg" alt="Computer"/>,

      languageTranscript1:  <div className="file pointer" onClick={() => {this.openApplication("languageTranscript1")}} ><p><img className="icon" src="/desktop/file.svg" alt="File icon"/>transcript_20160103.pdf</p></div>,
      languageTranscript2:  <div className="file pointer" onClick={() => {this.openApplication("languageTranscript2")}} ><p><img className="icon" src="/desktop/file.svg" alt="File icon"/>transcript_20160521.pdf</p></div>,
      alienArticle:  <div className="file pointer" onClick={() => {this.openApplication("alienArticle")}} ><p><img className="icon" src="/desktop/file.svg" alt="File icon"/>journal_20151113.pdf</p></div>,
    }

    // File System ShortCuts
    this.fileSystemFolders = {
      info: {
        requirement: 10,
        display: "Info",
        files: {
          directory: {
            requirement: 10,
            display: "building_directory.pdf",
          }
        },
      },
      agreements: {
        requirement: 100,
        display: "Contracts"
      },
      blueprints: {
        requirement: 30,
        display: "Blueprints",
        files: {
          floorPlan1: {
            requirement: 100,
            display: "floor1.bp",
          },
          floorPlan2: {
            requirement: 100,
            display: "floor2.bp",
          },
          floorPlan3: {
            requirement: 100,
            display: "floor3.bp",
          },
          floorPlan4: {
            requirement: 30,
            display: "floor4.bp",
          },
          floorPlan5: {
            requirement: 100,
            display: "floor5.bp",
          },
        },
      },
      security: {
        requirement: 30,
        display: "Security",
        files: {
          emergencies: {
            requirement: 100,
            display: "emergency_procedures.pdf",
          },
          securityManual: {
            requirement: 30,
            display: "security_sensors.pdf",
          },
          guestPolicy: {
            requirement: 100,
            display: "guest_policy.pdf",
          },
        },
      },
      inventory: {
        requirement: 100,
        display: "Inventory",
      },
      guards: {
        requirement: 50,
        display: "Personnel",
        files: {
          guard1: {
            requirement: 50,
            display: "A_Shakeb.db",
          },
          guard2: {
            requirement: 100,
            display: "H_Diana.db",
          },
          guard3: {
            requirement: 100,
            display: "H_Joshua.db",
          },
          guard4: {
            requirement: 100,
            display: "H_Victor.db",
          },
          guard5: {
            requirement: 100,
            display: "P_Shannon.db",
          },
          guard6: {
            requirement: 100,
            display: "T_Anand.db",
          },
          guard7: {
            requirement: 50,
            display: "W_Patricia.db",
          },
          guard8: {
            requirement: 100,
            display: "Z_Dillon.db",
          },
        },
      },
      // research: {
      //   requirement: 60,
      //   display: "Research",
      //   files: {
      //     languageTranscript1: {
      //       requirement: 60,
      //       display: "transcript_20160103.pdf",
      //     },
      //     languageTranscript2: {
      //       requirement: 60,
      //       display: "transcript_20160521.pdf",
      //     },
      //     alienArticle: {
      //       requirement: 60,
      //       display: "article.pdf",
      //     },
      //   },
      // },
      schedule: {
        requirement: 100,
        display: "Meeting Schedules"
      },
    }

    // Desktop Short Cuts
      this.shortcuts = {
        secureChat: {
          requirement: 0,
          app: (
            <div key="chat-shortcut" className="shortcut" onClick={() => {this.openApplication("secureChat")}}>
              <div className="icon">
                <img src="/desktop/secure-chat.svg" alt="Secure chat shortcut icon"/>
              </div>
              <div className="shortcut-name">Secure Chat</div>
            </div>
          ),
        },
        timer: {
          requirement: 10,
          app: (
            <div key="timer-shortcut" className="shortcut" onClick={() => {this.openApplication("timer")}}>
              <div className="icon">
                <img src="/desktop/timer.svg" alt="Timer shortcut icon"/>
              </div>
              <div className="shortcut-name">Timer</div>
            </div>
          )
        },
        fileSystem: {
          requirement: 15,
          app: (
            <div key="file-system-shortcut" className="shortcut" onClick={() => {this.openApplication("fileSystem")}}>
              <div className="icon">
                <img src="/desktop/filesystem.svg" alt="Filesystem shortcut icon"/>
              </div>
              <div className="shortcut-name">Files</div>
            </div>
          )
        },
        videoStream: {
          requirement: 40,
          app: (
            <div key="video-stream-shortcut" className="shortcut" onClick={() => {this.openApplication("videoStream")}}>
              <div className="icon">
                <img src="/desktop/video-stream.svg" alt="Video Stream shortcut icon"/>
              </div>
              <div className="shortcut-name">Video Stream</div>
            </div>
          )
        },
        translator: {
          requirement: 60,
          app: (
            <div key="translator-shortcut" className="shortcut" onClick={() => {this.openApplication("translator")}}>
              <div className="icon">
                <img src="/desktop/translator.svg" alt="Translator shortcut icon"/>
              </div>
              <div className="shortcut-name">Translator</div>
            </div>
          ),
        },
      }

    this.apps = {
      secureChat: {
        name: "Secure Chat",
        html: <Chat room={this.room} viewer={this.state.username} chatColor={this.state.chatColor} socket={this.socket} files={this.chatFiles} />
      },
      timer: {
        name: "Timer",
        html: <Timer socket={this.socket}/>
      },
      fileSystem: {
        name: "File System",
        html: <FileSystem socket={this.socket} folders={this.fileSystemFolders} level={state} openCallBack={this.openApplication} />
      },
      videoStream: {
        name: "Video Stream - Streaming from @lex",
        html: <VideoStream socket={this.socket} />
      },
      translator: {
        name: "Translator",
        html: <Translator />
      },
      // Chat Pop-ups

      // Add chat pop-ups here
      warehouse: {
        name: "IMG083098",
        html: <img src="/warehouse.jpg" style={{maxHeight: 500}} alt="Warehouse exterior"/>,
      },
      no_thermal_warehouse: {
        name: "IMG083104",
        html: <Panorama image={warehouse_1dark}></Panorama>,
      },
      thermal_warehouse: {
        name: "IMG083112",
        html: <Panorama image={warehouse_2thermal}></Panorama>,
      },
      thermal_warehouse_wires: {
        name: "IMG083118",
        html: <Panorama image={warehouse_3powered}></Panorama>,
      },
      elevator_landing: {
        name: "IMG083120",
        html: <img src="/hallways/hallway.jpg" style={{maxHeight: 500}} alt="Hallways outside elevator"/>,
      },
      vault_door: {
        name: "IMG083123",
        html: <img src="/vault/door.jpg" style={{maxHeight: 500}} alt="Vault door"/>,
      },
      tubes: {
        name: "IMG083125",
        html: <img src="/vault/tubes.jpg" style={{maxHeight: 500}} alt="Tubes"/>,
      },
      brain: {
        name: "IMG083128",
        html: <img src="/vault/brain.jpg" style={{maxHeight: 500}} alt="Brain"/>,
      },
      subject1: {
        name: "IMG083130",
        html: <img src="/vault/subject1.jpg" style={{maxHeight: 500}} alt="Subject"/>,
      },
      subject2: {
        name: "IMG083131",
        html: <img src="/vault/subject2.jpg" style={{maxHeight: 500}} alt="Subject"/>,
      },
      computer: {
        name: "IMG083137",
        html: <img src="/vault/computer.jpg" style={{maxHeight: 500}} alt="Computer"/>,
      },

      // File System Pop ups
      directory: {
        name: "Document Viewer - Building Directory",
        html: directory,
      },
      floorPlan4: {
        name: "Floor Planner - Floor 4 Plan",
        html: <FloorPlan level={state} socket={this.socket} roomCode={this.room} sender={this.state.username} color={this.state.chatColor} />,
      },
      securityManual: {
        name: "Document Viewer - Security Sensors",
        html: securityManual,
      },
      guard1: {
        name: "Database - A. Shakeb",
        html: guard1,
      },
      guard7: {
        name: "Database - W. Patricia",
        html: guard2,
      },
      languageTranscript1: {
        name: "Document Viewer - transcript_20160103",
        html: languageTranscript1,
      },
      languageTranscript2: {
        name: "Document Viewer - transcript_20160521",
        html: languageTranscript2,
      },
      alienArticle: {
        name: "Document Viewer - journal_20151113",
        html: alienArticle,
      },
    }

    this.setState(prev => ({
      state,
      applicationsOpen: [...prev.applicationsOpen, ...stateApplications[state].filter(s => prev.applicationsOpen.indexOf(s) === -1)],
      error: "",
    }));

    });

  this.socket.on("errorMessage", ({message}) => {
      this.setState({ error: message, unlocking: false });
    });
  }

  componentDidUpdate() {
    if (this.homeRef.current) {
      this.homeRef.current.scrollTop = 0;
    }
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.submitLogin();
    }
  }

  submitLogin = () => {
    this.socket.emit("joinRoom", { room: this.room, password: this.state.password });
    this.setState({ unlocking: true })
  }

  openApplication = (app) => {
    if (this.state.applicationsOpen.slice(-1)[0] === app) {
      return;
    }
    this.setState(state => ({
      applicationsOpen: [...state.applicationsOpen.filter(a => a !== app), app],
    }));
  }

  closeApplication = (app) => {
    this.setState(state => ({
      applicationsOpen: state.applicationsOpen.filter(a => a !== app),
    }));
  }

  render() {
    if (this.state.state === -1) {
      return this.renderLockScreen();
    }
    return this.renderDesktop();
  }

  renderLockScreen = () => {
    return (
      <div className="app guest">
        <div className="lock-screen" onKeyPress={this.handleKeyPress}>
          <div className="user-icon">
            <img src="/desktop/user.svg" alt="User icon"/>
          </div>
          <h1>Guest Login</h1>
          {this.state.error && <p className="error-message">{this.state.error}</p>}
          <label>
            <input
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={(e) => {
                const value = e.target.value;
                this.setState({ username: value })
              }}
              disabled={this.state.unlocking}
            />
          </label>
          <label>
            <input
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={(e) => {
                const value = e.target.value;
                this.setState({ password: value })
              }}
              disabled={this.state.unlocking}
            />
          </label>
          <button
            onClick={this.submitLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  renderDesktop = () => {
    return (
      <div className="app guest">
        { this.state.state === STATE_FAILURE &&
          <div className="noise-wrapper failure">
            <div className="noise"></div>
            <h1>Connection Lost</h1>
          </div>
        }
        { this.state.state === STATE_SUCCESS &&
          <div className="noise-wrapper success">
            <div className="noise"></div>
            <h1>Disconnected</h1>
          </div>
        }
        <div className="header">
          <div className="header-time">
            {this.state.username} &middot; {this.state.currentTime}
          </div>
        </div>
        <div className="home-screen" ref={this.homeRef}>
          {Object.keys(this.shortcuts)
            .filter(app => this.shortcuts[app].requirement <= this.state.state)
            .map(app => {
              // console.log(app, this.shortcuts[app])
              return this.shortcuts[app].app;
            })
          }
          {Object.keys(this.apps)
            .map((app, offset) => {
              return (
                <Draggable
                  key={app}
                  visible={true}
                  topCall={() => { this.openApplication(app) } }
                  closeCall={() => { this.closeApplication(app) } }
                  appName={this.apps[app].name}
                  zIndex={this.state.applicationsOpen.indexOf(app)}
                  offset={offset}
                  overflowHidden={app === 'videoStream'}
                >
                  {this.apps[app].html}
                </Draggable>);
            })
          }
        </div>
      </div>
    );
  }

}

export default Guest;