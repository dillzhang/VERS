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

    this.state = {
      applicationsAvailable: {
        secureChat: true,
        timer: true,
        fileSystem: false,
      },
      applicationsOpen: {
        secureChat: false,
        timer: false,
        fileSystem: false,
      }
    }

    this.shortcuts = {
      secureChat: (<div className="shortcut" onClick={() => {this.openApplication("secureChat")}}>
        <div className="icon" />
        <div className="shortcut-name">Secure Chat</div>
      </div>),
      timer: (<div className="shortcut" onClick={() => {this.openApplication("timer")}}>
        <div className="icon" />
        <div className="shortcut-name">Timer</div>
      </div>),
      fileSystem: (<div className="shortcut"  onClick={() => {this.openApplication("fileSystem")}}>
        <div className="icon" />
        <div className="shortcut-name">FileSystem</div>
      </div>),
    }
    
    this.apps = {
      secureChat: {
        name: "Secure Chat",
        html: <Chat room={this.room} viewer="guest" socket={this.socket}/>
      },
      timer: {
        name: "Timer",
        html: <Timer socket={this.socket}/>
      },
      fileSystem: {
        name: "File System",
        html: <FileSystem {...fs} callBack={() => {console.log("FS")}} />
      },
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.socket.emit("joinRoom", this.room);

    console.log(`Player Room ${this.room}`)
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        <div className="guest-container">
          <div className="header">
            <div className="header-time">
              22:26
            </div>
          </div>
          <div className="home-screen">
            {Object.keys(this.state.applicationsAvailable)
              .filter(app => this.state.applicationsAvailable[app])
              .map(app => {
                return this.shortcuts[app];
              })
            }
            {Object.keys(this.state.applicationsOpen)
              .filter(app => this.state.applicationsOpen[app])
              .map(app => {
                return (
                  <Draggable 
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
      </div>
    );
  }

  openApplication = (app) => {
    console.log(`Opening ${app}`)
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