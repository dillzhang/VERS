import React, { Component } from "react";
import * as SocketIO from "socket.io-client";

import "./Host.css";

import Chat from "../components/Chat";
import Email from "../components/Email";
import Timer from "../components/Timer";
import Elevator from "../components/Elevator";
import ActorMoving from "../components/ActorMoving";
import FloorPlan from "../fileSystem/FloorPlan";
import VaultDoor from "../components/VaultDoor";
import Translator from "../components/Translator";

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
      failed: false,
      lines: [],
      chatColor: "#65fc31",
    };

    this.socket.on("joinRoomStatus", ({ state, failed, password }) => {
      this.setState({
        state,
        lines: [],
        failed,
        playerUrl: `${baseProto}//${baseURL}/player/${this.props.match.params.code}/${password}`,
      });
    });

    this.socket.on("roomStateUpdate", ({ state, failed }) => {
      this.setState((prev) => ({
        state,
        lines: state % 10 === 0 ? [] : prev.lines,
        failed,
      }));
    });

    this.socket.on("update-line-from-submission", ({ line }) => {
      this.setState((prev) => ({
        lines: [line, ...prev.lines],
      }));
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

  componentDidUpdate(_, prevState) {
    if (
      Math.floor(prevState.state / 10) !== Math.floor(this.state.state / 10) &&
      this.currentActDiv
    ) {
      if (prevState.state === 0) {
        setTimeout(() => {
          this.currentActDiv.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 1000);
      } else {
        this.currentActDiv.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
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

  renderMain = () => {
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
                ref={(el) => {
                  if (act === currentAct) {
                    this.currentActDiv = el;
                  }
                }}
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
  };

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
          className="confirm"
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
            There is a Floor Directory located within the Info folder of the
            File System.
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
        <h2>Hugging the Wall</h2>
        <p>
          "There's a bunch of security here. I gotta lay low. Here's what I'm
          seeing"
        </p>
        <button
          onClick={() => {
            this.sendFile("elevator_landing");
          }}
        >
          (1) Send Hallway Image
        </button>
        <h2>Plotting the Sensors</h2>
        <p>
          <strong>
            subfloor3.bp and security_invoice.pdf have been unlocked.
          </strong>
        </p>

        <FloorPlan
          level={this.state.state}
          socket={this.socket}
          roomCode={this.room}
          sender={"@lex"}
          color={this.state.chatColor}
          host={true}
        />
        {30 <= this.state.state && this.state.state < 40 && (
          <>
            <h2>
              <strong>Responding to the Hackers</strong>
            </h2>
            {this.state.lines.length === 0 && (
              <p>
                <em>Wait for the hackers to export to chat.</em>
              </p>
            )}
            {this.state.lines.length > 0 &&
              this.state.lines.map((line, index) => {
                return (
                  <p
                    key={`translation-response-${index}`}
                    className={`${index === 0 ? "current" : "older"}`}
                  >
                    {line}
                  </p>
                );
              })}
          </>
        )}
        {this.state.state >= 39 && (
          <>
            <h2>Security Sensors Found</h2>
            <p>"I’m sharing my location with you."</p>
            <button
              onClick={() => {
                this.socket.emit("setRoomState", {
                  roomCode: this.room,
                  state: 40,
                });
              }}
              className="warning"
            >
              (2) Share Location
            </button>
          </>
        )}
      </>
    );
  }

  maybeRenderP2B() {
    return (
      <>
        <h2>The Electrical Panel</h2>
        <p>
          "I found this electrical panel. I'll send you a video stream of it."
        </p>
        <button
          className={`confirm`}
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 45,
            });
          }}
        >
          (1) Send Live Stream
        </button>
        <h2>Navigating the Security</h2>
        <p>
          <em>Hackers guide you through the security.</em>
        </p>
        <p>
          <strong>
            The specificity of the directions are up to you, but ease up as the
            attempts rack up.
          </strong>
        </p>
        <ActorMoving
          socket={this.socket}
          room={this.room}
          level={this.state.state}
        />
        <p>
          <strong>
            The electrical panel correspond with sensors in the floor plan.
          </strong>
        </p>
        <p>
          <strong>
            The security_invoice.pdf states only the cameras will fail. The
            mirror can be used to avoid laser trip wires.
          </strong>
        </p>
        <p>
          <strong>
            Use the Skip Puzzle if you feel the novelty of the puzzle has worn
            off.
          </strong>
        </p>
      </>
    );
  }

  maybeRenderP3A() {
    return (
      <>
        <h2>The Locked Door</h2>
        <p>
          "Whew, I made it to the vault door! I can’t believe it. We’re so
          close. Here's a picture."
        </p>
        <button
          onClick={() => {
            this.sendFile("vault_door");
          }}
        >
          (1) Send Vault Door Image
        </button>
        <h2>Unlocking the Door</h2>
        <p>"Door has a keyboard next to it. It's asking for an ID number."</p>
        <VaultDoor socket={this.socket} room={this.room} />
        <p>
          <strong>Personnel files have been unlocked.</strong>
        </p>
        <p>
          <strong>Only essential employees can access the vault.</strong>
        </p>
        <p>
          <strong>
            Use the Skip Puzzle if you feel the novelty of the puzzle has worn
            off.
          </strong>
        </p>
      </>
    );
  }

  maybeRenderP3B() {
    return (
      <>
        <h2>Inside the Lab</h2>
        <p>
          "We’re in. Whoa. It’s a secret laboratory. It’s all eerie and green in
          here."
        </p>
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
        <h2>The Computer</h2>
        <p>
          "Oh! I found a lab computer. It looks like it’s running some terminal
          code. Let me take a crack at it to see if I can find anything."
        </p>
        <button
          onClick={() => {
            this.sendFile("computer");
          }}
        >
          (3) Send Computer
        </button>
        <h2>The Files</h2>
        <p>
          "I’m sending over a couple of documents from this folder named
          “CONFIDENTIAL”. The answer’s probably in there. Can you read them out
          to me?"
        </p>
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
        <p>
          <strong>
            If hackers don't notice the translator app, pop up the app for them.
          </strong>
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 65,
            });
          }}
          className="confirm"
        >
          (6) Send Translator Application
        </button>
        <p>Milk the story a bit before sending Transcript 2.</p>
        <button
          onClick={() => {
            this.sendFile("languageTranscript2");
          }}
          className="highlight"
        >
          (7) Send Transcript 2
        </button>
        <h2>The Rest of the Room</h2>
        <p>Sell the fact you are in the room. Share images as you see fit.</p>
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
        <Translator socket={this.socket} host={true} />
        {60 <= this.state.state && this.state.state < 70 && (
          <>
            <h2>
              <strong>Responding to the Hackers</strong>
            </h2>
            {this.state.lines.length === 0 && (
              <p>
                <em>Wait for the hackers to export to chat.</em>
              </p>
            )}
            {this.state.lines.length > 0 &&
              this.state.lines.map((line, index) => {
                return (
                  <p
                    key={`translation-response-${index}`}
                    className={`${index === 0 ? "current" : "older"}`}
                  >
                    {line}
                  </p>
                );
              })}
          </>
        )}
        {this.state.state >= 69 && (
          <>
            <h2>The Truth Comes Out</h2>
            <p>
              "What?! No way. I'll send these documents to the New York Times
              and Washington Post right away. The world needs to know what the
              government is really hiding."
            </p>
            <button
              onClick={() => {
                this.socket.emit("startRoomSuccess", {
                  roomCode: this.room,
                });
              }}
              className="warning"
            >
              (12) Send the Email
            </button>
          </>
        )}
      </>
    );
  }

  maybeRenderSuccess() {
    return (
      <>
        <h2>The Emails</h2>
        <Email
          socket={this.socket}
          level={this.state.state}
          failed={this.state.failed}
        />
        {this.state.state >= 74 && (
          <>
            <h2>Success! We did it!</h2>
            <p>
              <em>Turn your video back on.</em>
            </p>
            <p>
              Congratulate the players. Ask if they have any questions about any
              of the puzzles. Encourage them to fill out the feedback form.
            </p>
          </>
        )}
      </>
    );
  }

  maybeRenderFailure() {
    return (
      <>
        <h2>Captured</h2>
        <p>You have been captured.</p>
        <p>
          <em>Turn your video back on.</em>
        </p>
        <p>
          Break the news to the players and explain to them the puzzles.
          Encourage them to fill out the feedback form.
        </p>
        <h2>1. Abandoned Warehouse</h2>
        <p>
          Hackers should have used the thermal camera image to guide you to the
          electrical box and Esalevator.
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 10,
            });
          }}
          className="confirm"
        >
          Go to Warehouse
        </button>
        <h2>2. Old Elevator</h2>
        <p>Hackers should have used the Floor Directory to pick sublevel 3.</p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 20,
            });
          }}
          className="confirm"
        >
          Go to Elevator
        </button>
        <h2>3. Hiding Hallway</h2>
        <p>
          Hackers should have used the Floor Plan and Security Invoice to plot
          the sensors.
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 30,
            });
          }}
          className="confirm"
        >
          Go to Hallway
        </button>
        <h2>4. Navigating Hallway</h2>
        <p>
          Hackers should have used the Video Stream and Floor Plan to guide you
          to the vault.
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 40,
            });
          }}
          className="confirm"
        >
          Start Navigating
        </button>
        <h2>5. Vault Door</h2>
        <p>
          Hackers should use Personnel File of Patricia Will to reset her Vault
          password.
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 50,
            });
          }}
          className="confirm"
        >
          Go to Door
        </button>
        <h2>6. Inside the Vault</h2>
        <p>
          Hackers should translate the Journal entry and using the interview
          transcripts.
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 60,
            });
          }}
          className="confirm"
        >
          Go to Vault
        </button>
      </>
    );
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
                  if (currentPuzzle === 6) {
                    this.socket.emit("setRoomState", {
                      roomCode: this.room,
                      state: 69,
                    });
                    this.socket.emit("startRoomSuccess", {
                      roomCode: this.room,
                    });
                  } else {
                    this.socket.emit("setRoomState", {
                      roomCode: this.room,
                      state: (currentPuzzle + 1) * 10,
                    });
                  }
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
