import React, { Component } from 'react';
import * as SocketIO from "socket.io-client";
// import ReactAudioPlayer from 'react-audio-player';
import Draggable from "../components/Draggable";

import shortcutCreator from "../constants/shortcuts";
import chatFilesCreator from "../constants/chatFiles";
import appCreator from "../constants/apps";
import {
  chatColors,
  STATE_SUCCESS,
  STATE_FAILURE,
  stateApplications,
  alwayVisibleSet,
} from "../constants/guest";

import './Guest.css'


const baseURL = new URL(window.location.href).host;

class Guest extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;
    this.password = this.props.match.params.password;
    this.homeRef = React.createRef();

    const currentTime = new Date();
    const today = String(currentTime.getMonth() + 1).padStart(2, "0") + "/" + String(currentTime.getDate()).padStart(2, "0") + "/" + currentTime.getFullYear();

    this.state = {
      state: -1,

      username: "",
      password: this.password,
      unlocking: false,

      chatColor: chatColors[Math.floor(Math.random() * chatColors.length)],

      currentTime: today,
      applicationsOpen: [],

      activeSounds: [],
      soundsToRemove: [],
    };

    this.socket.on("roomStateUpdate", ({ state }) => {
      this.setState(prev => ({
        state,
        error: "",
      }), () => {
        stateApplications[state].forEach(app => { this.openApplication(app) });
        if (stateApplications[state].length > 0 && state > 0) {
          this.playSound("new-app", "sound-new-app", "/sounds/new-app.ogg")
        }
      });

      this.socket.on('reconnect', (_) => {
        this.socket.emit("rejoinRoom", { room: this.room, password: this.state.password });
      });
    });

    this.socket.on("joinRoomStatus", ({ state }) => {
      // Desktop Short Cuts
      this.shortcuts = shortcutCreator(this.openApplication);
      const chatFiles = chatFilesCreator(this.openApplication);
      this.apps = appCreator(this.openApplication, this.closeApplication, this.room, state, this.state, this.socket, chatFiles, this.playSound);

      this.setState(prev => ({
        state,
        error: "",
      }), () => {
        stateApplications[state].forEach(app => { this.openApplication(app) });
      });

    });

    this.socket.on("errorMessage", ({ message }) => {
      this.setState({ error: message, unlocking: false });
    });
  }

  componentDidUpdate() {
    if (this.homeRef.current) {
      this.homeRef.current.scrollTop = 0;
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitLogin();
    }
  }

  handleDesktopClick = () => {
    this.playSound('click', 'sound-click', '/sounds/click.ogg');
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

  submitLogin = () => {
    if (this.state.username.trim().toLowerCase() === "@lex" || this.state.username.trim().toLowerCase() === "") {
      this.setState({ error: "Invalid Username" });
      return;
    }
    this.socket.emit("joinRoom", { room: this.room, password: this.state.password });
    this.setState({ unlocking: true })
  }

  openApplication = (app) => {
    if (this.state.applicationsOpen.slice(-1)[0] === app) {
      return;
    }

    if (app === "floorPlan4" && this.state.applicationsOpen.indexOf("videoStream") > -1) {
      this.openApplication("tooMuchRamPopUp");
      this.playSound("warning", "sound-warning", "/sounds/warning.ogg");
      return;
    }

    if (app === "videoStream" && this.state.applicationsOpen.indexOf("floorPlan4") > -1) {
      this.openApplication("tooMuchRamPopUp");
      this.playSound("warning", "sound-warning", "/sounds/warning.ogg");
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
            <img src="/desktop/user.svg" alt="User icon" />
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
                this.setState({ error: "", username: value })
              }}
              disabled={this.state.unlocking}
            />
          </label>
          {!this.password && (
            <label>
              <input
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={(e) => {
                  const value = e.target.value;
                  this.setState({ error: "", password: value })
                }}
                disabled={this.state.unlocking}
              />
            </label>)}
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
      <div className="app guest" onMouseDown={this.handleDesktopClick}>
        { this.state.state === STATE_FAILURE &&
          <div className="noise-wrapper failure">
            <div className="noise"></div>
            <div className="content">
              <h1>Connection Lost</h1>
              <h6>How did we do? Send us your feedback <a href="//forms.gle/bYNKqATrJZBpuRAQA" target="_blank">here</a>.</h6>
            </div>
          </div>
        }
        { this.state.state === STATE_SUCCESS &&
          <div className="noise-wrapper success">
            <div className="noise"></div>
            <div className="content">
              <h1>Disconnected</h1>
              <h6>How did we do? Send us your feedback <a href="//forms.gle/c5deR3t2bEucEr2z5" target="_blank">here</a>.</h6>
            </div>
          </div>
        }
        {/* <div className="sounds">
          {this.state.activeSounds.map((sound, idx) => {
              return (
                <ReactAudioPlayer
                  key={sound.id + '-' + idx}
                  className={sound.class}
                  src={sound.source}
                  autoPlay
                />);
            })
          }
        </div> */}
        <div className="header">
          <div className="header-time">
            {this.state.username} &middot; {this.state.currentTime}
          </div>
        </div>
        <div className="home-screen" ref={this.homeRef}>
          {Object.keys(this.shortcuts)
            .filter(app => this.shortcuts[app].requirement <= this.state.state)
            .map(app => {
              return this.shortcuts[app].app;
            })
          }
          {Object.keys(this.apps)
            .map((app, offset) => {
              const index = this.state.applicationsOpen.indexOf(app);
              return (
                <Draggable
                  key={app}
                  visible={index !== -1}
                  alwaysVisible={alwayVisibleSet.has(app)}
                  topCall={() => { this.openApplication(app) }}
                  closeCall={() => { this.closeApplication(app) }}
                  appName={this.apps[app].name}
                  zIndex={index}
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