import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";

import Chat from "../components/Chat";
import Draggable from "../components/Draggable";
import FileSystem from "../components/FileSystem"
import Timer from "../components/Timer";

import './Guest.css'

const fs = {
  type: "fs",
  value: "root",
  sub: [
    {
      type: "fs",
      value: "map",
      sub: [
        {
          type: "ref",
          value: "map1",
          action: "map1"
        },
        {
          type: "ref",
          value: "map2",
          action: "map2"
        },
        {
          type: "ref",
          value: "map3",
          action: "map3"
        },
      ]
    },
    {
      type: "fs",
      value: "documents",
      sub: [
        {
          type: "ref",
          value: "handbook",
          action: "handbook"
        },
      ]
    }
  ]
}

const baseURL = new URL(window.location.href).host;

class Guest extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;

    const today = new Date();
    const time = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);

    this.state = {
      state: -1,

      username: "Johnny",
      password: "$ecretPassw0rd",
      unlocking: false,

      currentTime: time,

      applicationsAvailable: {},
      applicationsOpen: {},
    }

    setInterval(() => {
      const today = new Date();
      const time = ("0" + today.getHours()).slice(-2) + ":" + ("0" + today.getMinutes()).slice(-2) + ":" + ("0" + today.getSeconds()).slice(-2);
      this.setState({ currentTime: time });
    }, 499);

    this.socket.on("roomStatus", ({state}) => {
      console.log(state);
      // Add chat files here
      this.chatFiles = {
        file1: <img onClick={() => {this.openApplication("file1")}} src="https://ichef.bbci.co.uk/news/410/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg" style={{ height: "60px", width: "80px" }}/>,
      }

      // File System ShortCuts
      this.fileSystemFiles = {
      }
      
      // Desktop Short Cuts
      this.shortcuts = {
        secureChat: {
          requirement: 0,
          app: (
            <div key="chat-shortcut" className="shortcut" onClick={() => {this.openApplication("secureChat")}}>
              <div className="icon" />
              <div className="shortcut-name">Secure Chat</div>
            </div>
          ),
        },
        timer: {
          requirement: 10,
          app: (
            <div key="timer-shortcut" className="shortcut" onClick={() => {this.openApplication("timer")}}>
              <div className="icon" />
              <div className="shortcut-name">Timer</div>
            </div>
          )
        },
        fileSystem: {
          requirement: 20,
          app: (
            <div key="file-system-shortcut" className="shortcut" onClick={() => {this.openApplication("fileSystem")}}>
              <div className="icon" />
              <div className="shortcut-name">Files</div>
            </div>
          )
        },
      }

      this.apps = {
        secureChat: {
          name: "Secure Chat",
          html: <Chat room={this.room} viewer={this.state.username} socket={this.socket} files={this.chatFiles}/>
        },
        timer: {
          name: "Timer",
          html: <Timer socket={this.socket}/>
        },
        fileSystem: {
          name: "File System",
          html: <div>FILES</div>
        },

        // Chat Pop-ups

        // Add chat pop-ups here
        file1: {
          name: "Photos - File1",
          html: <img src="https://ichef.bbci.co.uk/news/410/cpsprodpb/12A9B/production/_111434467_gettyimages-1143489763.jpg" />,
        }

        // File System Pop ups
      }
      
      this.setState({ 
          state, 
          error: "",
          applicationsOpen: {
            secureChat: false,
            timer: false,
          },
      });
    });

    this.socket.on("errorMessage", ({message}) => {
      this.setState({ error: message, unlocking: false });
    });
  }

  render() {
    if (this.state.state == -1) {
      return (
        <div className="app guest">
          <div className="lock-screen">
            <div className="user-icon" />
            <h1>Other User</h1>
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
              Login
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className="app guest">
        <div className="header">
          <div className="header-time">
            {this.state.username} - {this.state.currentTime}
          </div>
        </div>
        <div className="home-screen">
          {Object.keys(this.shortcuts)
            .filter(app => this.shortcuts[app].requirement <= this.state.state)
            .map(app => {
              console.log(app, this.shortcuts[app])
              return this.shortcuts[app].app;
            })
          }
          {Object.keys(this.state.applicationsOpen)
            .filter(app => this.state.applicationsOpen[app])
            .map(app => {
              return (
                <Draggable 
                  key={app}
                  visible={true}
                  closeCall={() => { this.closeApplication(app) } }
                  appName={this.apps[app].name}
                >
                  {this.apps[app].html}
                </Draggable>);
            })
          }
        </div>
      </div>
    );
  }

  openApplication = (app) => {
    this.setState(state => ({
      applicationsOpen: {...state.applicationsOpen, [app]: true}
    }));
  }

  closeApplication = (app) => {
    this.setState(state => ({
      applicationsOpen: {...state.applicationsOpen, [app]: false}
    }));
  }
  
}

export default Guest;