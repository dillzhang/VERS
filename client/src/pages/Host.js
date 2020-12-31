import React, { Component } from "react";
import * as SocketIO from "socket.io-client";

import "./Host.css";

import Chat from "../components/Chat";
import Timer from "../components/Timer";
import Elevator from "../components/Elevator";
import ActorMoving from "../components/ActorMoving";
import VaultDoor from "../components/VaultDoor";

import chatFilesCreator from "../constants/chatFiles";
import { STATE_FAILURE, STATE_SUCCESS } from "../constants/guest";
import { actHeaders } from "../constants/host";

const baseURL = new URL(window.location.href).host;
const baseProto = new URL(window.location.href).protocol;

const chatFiles = chatFilesCreator((_) => {});

class Host extends Component {
  // Initialize the state
  constructor(props) {
    super(props);

    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;

    this.state = {
      state: 0,
      lines: [],
      chatColor: "#65fc31",
    };

    this.socket.on("joinRoomStatus", ({ state, password }) => {
      this.setState({
        state,
        playerUrl: `${baseProto}//${baseURL}/player/${this.props.match.params.code}/${password}`,
      });
    });

    this.socket.on("roomStateUpdate", ({ state }) => {
      this.setState({
        state,
      });
    });

    this.socket.on("update-line-from-submission", ({ line }) => {
      this.setState({
        lines: [line],
      });
    });

    this.socket.on("reconnect", (_) => {
      this.socket.emit("rejoinRoom", { room: this.room, password: "HOST" });
    });
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.socket.emit("joinRoom", { room: this.room, password: "HOST" });
  }

  render() {
    return (
      <div className="app host">
        <div className={`header`}>
          <h1>VERS Actor Panel</h1>
          {this.maybeRenderPlayerLink()}
        </div>
        {this.renderMain()}
        {this.renderSideBar()}
      </div>
    );
  }

  maybeRenderPlayerLink() {
    return (
      <div className={`player-link`}>
        {this.state.playerUrl && (
          <a href={this.state.playerUrl} target="_blank">
            {this.state.playerUrl}
          </a>
        )}
        <button
          onClick={() => {
            navigator.clipboard.writeText(this.state.playerUrl);
          }}
        >
          Copy Player URL
        </button>
      </div>
    );
  }

  renderMain() {
    const currentAct = Math.floor(this.state.state / 10);
    return (
      <div className="main">
        {[...Array(9).keys()]
          .filter((act) => {
            if (this.state.state >= 80) {
              // Render only failure state if players fail
              return act === 8;
            } else {
              // Render all states that have been seen
              return act <= currentAct;
            }
          })
          .map((act) => {
            return (
              <div
                key={`act-${act}`}
                className={`act act-${act} act-${
                  act === currentAct ? "active" : "inactive"
                }`}
              >
                <div className={`act-header act-header-${act}`}>
                  {actHeaders[act].value} - {actHeaders[act].setting}
                </div>
                {this.renderAct(act)}
              </div>
            );
          })}
      </div>
    );
  }

  renderAct(act) {
    switch (parseInt(act)) {
      case 0:
        return this.maybeRenderPreshow();
      case 1:
        return this.maybeRenderP1A();
      case 2:
        return this.maybeRenderP1B();
      case 3:
        return this.maybeRenderP2A();
      case 4:
        return this.maybeRenderP2B();
      case 5:
        return this.maybeRenderP3A();
      case 6:
        return this.maybeRenderP3B();
      case 7:
        return this.maybeRenderSuccess();
      case 8:
        return this.maybeRenderFailure();
      default:
        return <></>;
    }
  }

  maybeRenderPreshow = () => {
    return (
      <>
        <button
          onClick={() => {
            this.sendFile("backpack");
          }}
        >
          (1) Send Backpack Contents
        </button>
        <button
          onClick={() => {
            this.sendFile("warehouse");
          }}
        >
          (2) Send Warehouse Image
        </button>
        <button
          onClick={() => {
            this.socket.emit("start-time", { room: this.room });
          }}
          className="warning"
        >
          (3) Start Timer
        </button>
      </>
    );
  };

  maybeRenderP1A() {
    return <>P1A</>;
  }

  maybeRenderP1B() {
    return <>P1B</>;
  }

  maybeRenderP2A() {
    return <>P2A</>;
  }

  maybeRenderP2B() {
    return <>P2B</>;
  }

  maybeRenderP3A() {
    return <>P3A</>;
  }

  maybeRenderP3B() {
    return <>P3B</>;
  }

  maybeRenderSuccess() {
    return <>Success</>;
  }

  maybeRenderFailure() {
    return <>Failure</>;
  }
  renderSideBar() {
    return (
      <div className="side-bar">
        {this.renderTimerAndControls()}
        {this.renderChat()}
      </div>
    );
  }
  renderTimerAndControls() {
    return (
      <>
        <div className={`show-info`}>
          <Timer host={true} socket={this.socket} />
          <div className={`timeline`}>
            <div>Preshow</div>
            {[...Array(6).keys()].map((puzzle) => {
              return (
                <div
                  key={`progress-${puzzle}`}
                  className={`progress progress-${
                    puzzle + 1 < Math.floor(this.state.state / 10)
                      ? "complete"
                      : "incomplete"
                  }`}
                />
              );
            })}
            <div>Success</div>
          </div>
        </div>
        <div className={`show-controls`}>
          <button
            className={`add-time ${
              10 <= this.state.state && this.state.state < STATE_SUCCESS
                ? ""
                : "disabled"
            }`}
            onClick={() => {
              if (10 <= this.state.state && this.state.state < STATE_SUCCESS) {
                this.socket.emit("add-five-minutes", { roomCode: this.room });
              }
            }}
          >
            Add 5 Minutes
          </button>
          <button
            className={`${this.state.state >= STATE_SUCCESS ? "disabled" : ""}`}
            onClick={() => {
              const currentPuzzle = Math.floor(this.state.state / 10);
              console.log(currentPuzzle);
              if (currentPuzzle < 7) {
                const confirmation = window.confirm(
                  "Are you sure you want to skip this puzzle?"
                );
                if (confirmation) {
                  this.socket.emit("setRoomState", {
                    roomCode: this.room,
                    state: (currentPuzzle + 1) * 10,
                  });
                }
              }
            }}
          >
            Skip Puzzle
          </button>
          <button
            className={`warning ${
              this.state.state >= STATE_SUCCESS ? "disabled" : ""
            }`}
            onClick={() => {
              const currentPuzzle = Math.floor(this.state.state / 10);
              if (currentPuzzle < 7) {
                const confirmation = window.confirm("End the show?");
                if (confirmation) {
                  this.socket.emit("setRoomState", {
                    roomCode: this.room,
                    state: STATE_FAILURE,
                  });
                }
              }
            }}
          >
            {" "}
            End Show
          </button>
        </div>
      </>
    );
  }
  renderChat() {
    return (
      <Chat
        room={this.room}
        viewer="@lex"
        chatColor={this.state.chatColor}
        files={chatFiles}
        socket={this.socket}
        playSound={(_) => {}}
      />
    );
  }

  // Use this function to "send" files
  // content should be the id specified in Guest
  sendFile = (content) => {
    this.socket.emit("newFileMessage", {
      content,
      sender: "@lex",
      roomCode: this.room,
      color: this.state.chatColor,
    });
  };
}

export default Host;
