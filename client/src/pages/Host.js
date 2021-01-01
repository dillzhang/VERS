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
        <h2>Check In</h2>
        <p>"Comm check, one two one two."</p>
        <p>"Can you guys hear me? Whew, okay, good."</p>
        <h2>Intros</h2>
        <p>Greet each hacker by their name on Zoom.</p>
        <p>Ramble about the following:</p>
        <ul>
          <li>Thinking no one was going to help</li>
          <li>Planning mission for 2 years</li>
          <li>Flying JFK to Vegas</li>
        </ul>
        <h2>Vegas</h2>
        <p>
          Set the scene. It's hot out there! Maybe you should have brought some
          water with you.
        </p>
        <h2>Virtual Desktops</h2>
        <p>
          I custom built some virtual desktops for you to use — I’ll need you to
          use the tools on there to guide me as I go. Here, I’ll get you guys
          set up. I’ll put the link in the Zoom chat.
        </p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(this.state.playerUrl);
          }}
        >
          (1) Copy Player URL
        </button>
        <p>
          <em>Each hacker has sent a message in the Virtual Desktop Chat.</em>
        </p>
        <h2>Backpack</h2>
        <p>
          "I've packed a bag with some gear we might need: a thermal camera, a
          small mirror, and a multi-tool. Let me message you that list so you
          have a record."
        </p>
        <button
          onClick={() => {
            this.sendFile("backpack");
          }}
        >
          (2) Send Backpack Contents
        </button>
        <h2>Reception</h2>
        <p>
          "My reception is getting spotty, so I'm turning off my video now."
        </p>
        <p>
          <em>You have turned off your video.</em>
        </p>
        <h2>The Vault</h2>
        <p>Present your research about the vault:</p>
        <ul>
          <li>Evades all government records</li>
          <li>Only essential employees, not even guards</li>
          <li>Somewhere inside Area 51</li>
        </ul>
        <h2>Outside the Warehouse</h2>
        <p>
          "Huh, so... I've been walking around for a while, and all I can see is
          this abandoned warehouse."
        </p>
        <button
          onClick={() => {
            this.sendFile("warehouse");
          }}
        >
          (3) Send Warehouse Image
        </button>
        <p>"I'm gonna check it out."</p>
        <p>
          "Oh no! I think I tripped an alarm. I read that the site goes into
          total lockdown in 1 hour. Let's start a timer. We gotta move quick!"
        </p>
        <button
          onClick={() => {
            this.socket.emit("start-time", { room: this.room });
          }}
          className="warning"
        >
          (4) Start Timer
        </button>
      </>
    );
  };

  maybeRenderP1A = () => {
    return (
      <>
        <h2>It's Dark</h2>
        <p>"I made it into the warehouse. It's awful dark in here."</p>
        <button
          onClick={() => {
            this.sendFile("no_thermal_warehouse");
          }}
        >
          (1) Send Dark Warehouse Image
        </button>
        <h2>Thermal Camera</h2>
        <p>
          <em>Hackers have asked you to use the thermal camera.</em>
        </p>
        <p>
          "Good call! Sending over the image now. Let me know if you see
          anything interesting."
        </p>
        <button
          onClick={() => {
            this.sendFile("thermal_warehouse");
          }}
        >
          (2) Send Thermal Warehouse Image (Power Off)
        </button>
        <h2>A Hot Spot</h2>
        <p>
          <em>Hackers lead you to the hot spot.</em>
        </p>
        <p>"It seems to be an electrical box."</p>
        <p>
          "I got it open. There's an ethernet port and a lever. I'm attaching a
          transmitter so your desktops can hack into the network."
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 15,
            });
          }}
          className="warning"
        >
          (3) Flip Switch and Attach File System
        </button>
        <p>"I flipped the lever, but seems like nothing changed."</p>
        <h2>A Second Picture</h2>
        <p>
          <em>Hackers ask for another thermal camera image.</em>
        </p>
        <p>"Sending the image over. Anything change?"</p>
        <button
          onClick={() => {
            this.sendFile("thermal_warehouse_wires");
          }}
        >
          (4) Send Thermal Warehouse Image (Power On)
        </button>
        <h2>Path to the Elevator</h2>
        <p>
          <em>Hackers lead you to the elevator.</em>
        </p>
        <p>
          "Okay, I think I see a door. Hmm... the wall is pretty dusty here.""
        </p>
        <p>"A button? Wait of course, it's an elevator! I'm calling it now."</p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 20,
            });
          }}
          className="warning"
        >
          (5) Call the Elevator
        </button>
      </>
    );
  };

  maybeRenderP1B() {
    return (
      <>
        <h2>The Elevator</h2>
        <p>
          <em>Hackers tell you a floor to press.</em>
        </p>
        <p>
          <strong>
            Floor Directory is located within the Info folder of the File
            System.
          </strong>
        </p>
        <Elevator
          successCallback={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 29,
            });
          }}
        />

        {this.state.state >= 29 && (
          <>
            <h2>The Correct Floor</h2>
            <p>Exit the elevator when ready.</p>
            <button
              onClick={() => {
                this.socket.emit("setRoomState", {
                  roomCode: this.room,
                  state: 30,
                });
              }}
              className="warning"
            >
              (1) Exit the Elevator
            </button>
          </>
        )}
      </>
    );
  }

  maybeRenderP2A() {
    return (
      <>
        <button
          onClick={() => {
            this.sendFile("elevator_landing");
          }}
        >
          (1) Send Hallway Image
        </button>

        {this.state.state >= 39 && (
          <button
            onClick={() => {
              this.socket.emit("setRoomState", {
                roomCode: this.room,
                state: 40,
              });
            }}
            className="warning"
          >
            (2) Share location and stream
          </button>
        )}
      </>
    );
  }

  maybeRenderP2B() {
    return (
      <>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 45,
            });
          }}
        >
          (1) Send Live Stream
        </button>
        <ActorMoving socket={this.socket} room={this.room} />
      </>
    );
  }

  maybeRenderP3A() {
    return (
      <>
        <button
          onClick={() => {
            this.sendFile("vault_door");
          }}
        >
          (1) Send Vault Door Image
        </button>
        <VaultDoor socket={this.socket} room={this.room} />
      </>
    );
  }

  maybeRenderP3B() {
    return (
      <>
        <button
          onClick={() => {
            this.sendFile("tubes");
          }}
        >
          (1) Send Tubes
        </button>
        <button
          onClick={() => {
            this.sendFile("brain");
          }}
        >
          (2) Send Brain
        </button>
        <button
          onClick={() => {
            this.sendFile("computer");
          }}
        >
          (3) Send Computer
        </button>
        <button
          onClick={() => {
            this.sendFile("languageTranscript1");
          }}
          className="highlight"
        >
          (4) Send Transcript 1
        </button>
        <button
          onClick={() => {
            this.sendFile("alienArticle");
          }}
          className="highlight"
        >
          (5) Send Journal
        </button>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 65,
            });
          }}
          className="highlight"
        >
          (6) Send Translator Application
        </button>
        <button
          onClick={() => {
            this.sendFile("languageTranscript2");
          }}
          className="highlight"
        >
          (7) Send Transcript 2
        </button>
        <button
          onClick={() => {
            this.sendFile("cameras");
          }}
        >
          (8) Send Cameras
        </button>
        <button
          onClick={() => {
            this.sendFile("powder");
          }}
        >
          (9) Send Powder
        </button>
        <button
          onClick={() => {
            this.sendFile("subject1");
            this.sendFile("subject2");
          }}
        >
          (10) Send Subjects
        </button>
        <button
          onClick={() => {
            this.sendFile("baby");
          }}
        >
          (11) Send Baby
        </button>
        {this.state.state >= 69 && (
          <button
            onClick={() => {
              this.socket.emit("startRoomSuccess", {
                roomCode: this.room,
              });
            }}
            className="confirm"
          >
            (12) Start Email End Sequence
          </button>
        )}
      </>
    );
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
