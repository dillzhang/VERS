import React, { Component } from "react";
import * as SocketIO from "socket.io-client";
import Draggable from "../components/Draggable";

import shortcutCreator from "../constants/shortcuts";
import chatFilesCreator from "../constants/chatFiles";
import appCreator from "../constants/apps";
import {
  chatColors,
  STATE_FAILURE,
  STATE_LAST_EMAIL,
  stateApplications,
  alwayVisibleSet,
} from "../constants/guest";

import SoundPlayer from "../components/SoundPlayer";

import "./Guest.css";

const baseURL = new URL(window.location.href).host;

class Guest extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;
    this.password = this.props.match.params.password;
    this.homeRef = React.createRef();
    this.soundRef = React.createRef();

    const currentTime = new Date();
    const today =
      String(currentTime.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(currentTime.getDate()).padStart(2, "0") +
      "/" +
      currentTime.getFullYear();

    this.state = {
      state: -1,
      failed: false,

      username: "",
      password: this.password,
      unlocking: false,

      chatColor: chatColors[Math.floor(Math.random() * chatColors.length)],

      currentTime: today,
      applicationsOpen: [],
    };

    this.socket.on("roomStateUpdate", ({ state, failed }) => {
      this.setState(
        (prev) => ({
          state,
          failed,
          error: "",
        }),
        () => {
          stateApplications[state].forEach((app) => {
            this.openApplication(app);
          });
          if (stateApplications[state].length > 0 && state > 0) {
            this.playSound("newApp");
          }
        }
      );

      this.socket.on("reconnect", (_) => {
        this.socket.emit("rejoinRoom", {
          room: this.room,
          password: this.state.password,
        });
      });
    });

    this.socket.on("joinRoomStatus", ({ state, failed }) => {
      this.shortcuts = shortcutCreator(this.openApplication);
      const chatFiles = chatFilesCreator(this.openApplication);
      this.apps = appCreator(
        this.openApplication,
        this.closeApplication,
        this.room,
        state,
        { ...this.state, failed },
        this.socket,
        chatFiles,
        this.playSound
      );
      this.setState(
        (prev) => ({
          state,
          failed,
          error: "",
        }),
        () => {
          stateApplications[state].forEach((app) => {
            this.openApplication(app);
          });
        }
      );
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
    if (e.key === "Enter") {
      this.submitLogin();
    }
  };

  playSound = (soundId) => {
    if (this.soundRef && this.soundRef.current) {
      this.soundRef.current.playSound(soundId);
    }
  };

  handleDesktopClick = () => {
    this.playSound("click");
  };

  submitLogin = () => {
    if (
      this.state.username.trim().toLowerCase() === "@lex" ||
      this.state.username.trim().toLowerCase() === ""
    ) {
      this.setState({ error: "Invalid Username" });
      return;
    }
    this.socket.emit("joinRoom", {
      room: this.room,
      password: this.state.password,
    });
    this.setState({ unlocking: true });
  };

  openApplication = (app) => {
    if (this.state.applicationsOpen.slice(-1)[0] === app) {
      return;
    }

    if (
      app === "floorPlan4" &&
      this.state.applicationsOpen.indexOf("videoStream") > -1
    ) {
      this.openApplication("tooMuchRamPopUp");
      this.playSound("warning");
      return;
    }

    if (
      app === "videoStream" &&
      this.state.applicationsOpen.indexOf("floorPlan4") > -1
    ) {
      this.openApplication("tooMuchRamPopUp");
      this.playSound("warning");
      return;
    }

    this.setState((state) => ({
      applicationsOpen: [
        ...state.applicationsOpen.filter((a) => a !== app),
        app,
      ],
    }));
  };

  closeApplication = (app) => {
    this.setState((state) => ({
      applicationsOpen: state.applicationsOpen.filter((a) => a !== app),
    }));
  };

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
          {this.state.error && (
            <p className="error-message">{this.state.error}</p>
          )}
          <label>
            <input
              type="text"
              placeholder="Username"
              value={this.state.username}
              onChange={(e) => {
                const value = e.target.value;
                this.setState({ error: "", username: value });
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
                  this.setState({ error: "", password: value });
                }}
                disabled={this.state.unlocking}
              />
            </label>
          )}
          <button onClick={this.submitLogin}>Sign In</button>
        </div>
      </div>
    );
  };

  renderDesktop = () => {
    return (
      <div className="app guest" onMouseDown={this.handleDesktopClick}>
        {this.state.state === STATE_FAILURE && (
          <div className="noise-wrapper failure">
            <div className="noise"></div>
            <div className="content">
              <h1>Connection Lost</h1>
              <h2>Standby for Mission Debrief</h2>
              <h6>
                What did you think? Send us your feedback{" "}
                <a href="//forms.gle/bYNKqATrJZBpuRAQA" target="_blank">
                  here
                </a>
                .
              </h6>
            </div>
          </div>
        )}
        {this.state.state === STATE_LAST_EMAIL && (
          <div className="noise-wrapper success">
            <div className="content">
              <h2>Standby for Mission Debrief</h2>
            </div>
          </div>
        )}
        <div className="header">
          <div className="header-time">
            <SoundPlayer socket={this.socket} ref={this.soundRef} />{" "}
            <span>
              &middot; {this.state.username} &middot; {this.state.currentTime}
            </span>
          </div>
        </div>
        <div className="home-screen" ref={this.homeRef}>
          {Object.keys(this.shortcuts)
            .filter(
              (app) => this.shortcuts[app].requirement <= this.state.state
            )
            .map((app) => {
              return this.shortcuts[app].app;
            })}
          {Object.keys(this.apps).map((app, offset) => {
            const index = this.state.applicationsOpen.indexOf(app);
            return (
              <Draggable
                key={app}
                visible={index !== -1}
                alwaysVisible={alwayVisibleSet.has(app)}
                topCall={() => {
                  this.openApplication(app);
                }}
                closeCall={() => {
                  this.closeApplication(app);
                }}
                appName={this.apps[app].name}
                zIndex={index}
                offset={offset}
                overflowHidden={app === "videoStream"}
              >
                {this.apps[app].html}
              </Draggable>
            );
          })}
        </div>
      </div>
    );
  };
}

export default Guest;
