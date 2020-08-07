import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";

import Chat from "../components/Chat";
import Draggable from "../components/Draggable";
import FileSystem from "../components/FileSystem"
import Timer from "../components/Timer";
import Panorama from '../components/Panorama';
import Translator from '../components/Translator';

import './Guest.css'

import alienArticle from "../fileSystem/AlienArticle";
import directory from "../fileSystem/Directory";
import FloorPlan from "../fileSystem/FloorPlan";
import guard1 from "../fileSystem/Guard1";
import guard2 from "../fileSystem/Guard2";
import guard3 from "../fileSystem/Guard3";
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

const stateApplications = [
  ["secureChat"],  // 0
  ["timer"],  // 10
  ["fileSystem"],  //20
  [],  // 30
  [],  // 40
  [],  // 50
  [],  // 60
  [],  // 70
  [],  // 80
]


class Guest extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;

    this.state = {
      state: -1,

      username: "Johnny",  // Delete after testing
      password: "$ecretPassw0rd",  // Delete after testing
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
        applicationsOpen: [...prev.applicationsOpen, ...stateApplications[state / 10].filter(s => prev.applicationsOpen.indexOf(s) == -1)],
        error: "",
      }));
    });

    this.socket.on("joinRoomStatus", ({state}) => {
      // Chat Short Cuts
      this.chatFiles = {
        floor_plan_4: <div className="file" onClick={() => {this.openApplication("floorPlan4")}}><strong>Floor Plan 4.bp</strong></div>,

        no_thermal_warehouse: <img onClick={() => {this.openApplication("no_thermal_warehouse")}} src={warehouse_1dark_preview} style={{ height: "60px", width: "80px" }}/>,

        thermal_warehouse: <img onClick={() => {this.openApplication("thermal_warehouse")}} src={warehouse_2thermal_preview} style={{ height: "60px", width: "80px" }}/>,

        thermal_warehouse_wires: <img onClick={() => {this.openApplication("thermal_warehouse_wires")}} src={warehouse_3powered_preview} style={{ height: "60px", width: "80px" }}/>
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
            floorPlan6: {
              requirement: 100,
              display: "floor6.bp",
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
        guards: {
          requirement: 50,
          display: "Personnel",
          files: {
            guard1: {
              requirement: 50,
              display: "01-shakeb.db",
            },
            guard2: {
              requirement: 50,
              display: "02-patricia.db",
            },
            guard3: {
              requirement: 50,
              display: "03-jason.db",
            },
          },
        },
        research: {
          requirement: 60,
          display: "Research",
          files: {
            languageTranscript1: {
              requirement: 60,
              display: "transcript_20190103.pdf",
            },
            languageTranscript2: {
              requirement: 60,
              display: "transcript_20190521.pdf",
            },
            alienArticle: {
              requirement: 60,
              display: "press_article.pdf",
            },
          },
        },
      }

      // Desktop Short Cuts
      this.shortcuts = {
        secureChat: {
          requirement: 0,
          app: (
            <div key="chat-shortcut" className="shortcut" onClick={() => {this.openApplication("secureChat")}}>
              <div className="icon">
                <img src="/desktop/secure-chat.svg" />
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
              <img src="/desktop/timer.svg" /></div>
              <div className="shortcut-name">Timer</div>
            </div>
          )
        },
        fileSystem: {
          requirement: 20,
          app: (
            <div key="file-system-shortcut" className="shortcut" onClick={() => {this.openApplication("fileSystem")}}>
              <div className="icon">
                <img src="/desktop/filesystem.svg" />
              </div>
              <div className="shortcut-name">Files</div>
            </div>
          )
        },
        translator: {
          requirement: 60,
          app: (
            <div key="translator-shortcut" className="shortcut" onClick={() => {this.openApplication("translator")}}>
              <div className="icon">
                <img src="/desktop/translator.svg" />
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
        translator: {
          name: "Translator",
          html: <Translator socket={this.socket} />
        },
        // Chat Pop-ups

        // Add chat pop-ups here
        file1: {
          name: "Photos - File1",
          html: <img src="https://ichef.bbci.co.uk/news/410/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg" />,
        },

        no_thermal_warehouse: {
          name: "Warehouse - Dark",
          html: <Panorama image={warehouse_1dark}></Panorama>,
        },
        thermal_warehouse: {
          name: "Warehouse - Thermal",
          html: <Panorama image={warehouse_2thermal}></Panorama>,
        },
        thermal_warehouse_wires: {
          name: "Warehouse - Thermal with Wires",
          html: <Panorama image={warehouse_3powered}></Panorama>,
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
          name: "Database - Guard 1",
          html: guard1,
        },
        guard2: {
          name: "Database - Guard 2",
          html: guard2,
        },
        guard3: {
          name: "Database - Guard 3",
          html: guard3,
        },
        languageTranscript1: {
          name: "Document Viewer - Interview 1",
          html: languageTranscript1,
        },
        languageTranscript2: {
          name: "Document Viewer - Interview 2",
          html: languageTranscript2,
        },
        alienArticle: {
          name: "Document Viewer - Alien Article",
          html: alienArticle,
        },
      }
      this.setState(prev => ({
        state,
        applicationsOpen: [...prev.applicationsOpen, ...stateApplications[state / 10].filter(s => prev.applicationsOpen.indexOf(s) == -1)],
        error: "",
      }));
    });

    this.socket.on("errorMessage", ({message}) => {
      this.setState({ error: message, unlocking: false });
    });
  }

  openApplication = (app) => {
    if (this.state.applicationsOpen.slice(-1)[0] == app) {
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
    if (this.state.state == -1) {
      return this.renderLockScreen();
    }
    return this.renderDesktop();
  }

  renderLockScreen = () => {
    return (
      <div className="app guest">
        <div className="lock-screen">
          <div className="user-icon">
            <img src="/desktop/user.svg" />
          </div>
          <h1>Guest Login</h1>
          {this.state.error && <p>{this.state.error}</p>}
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
            onClick={() => {
              this.socket.emit("joinRoom", { room: this.room, password: this.state.password });
              this.setState({ unlocking: true })
            }}
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
        <div className="header">
          <div className="header-time">
            {this.state.username} &middot; {this.state.currentTime}
          </div>
        </div>
        <div className="home-screen">
          {Object.keys(this.shortcuts)
            .filter(app => this.shortcuts[app].requirement <= this.state.state)
            .map(app => {
              // console.log(app, this.shortcuts[app])
              return this.shortcuts[app].app;
            })
          }
          {this.state.applicationsOpen
            .filter(app => this.state.applicationsOpen.indexOf(app) > -1 && this.apps.hasOwnProperty(app))
            .map((app, index) => {
              return (
                <Draggable
                  key={app}
                  visible={true}
                  topCall={() => { this.openApplication(app) } }
                  closeCall={() => { this.closeApplication(app) } }
                  appName={this.apps[app].name}
                  zIndex={index}
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