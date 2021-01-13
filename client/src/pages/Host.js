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

import SoundPlayer from "../components/SoundPlayer";
import ActorSoundTrigger from "../components/ActorSoundTrigger";

const baseURL = new URL(window.location.href).host;
const baseProto = new URL(window.location.href).protocol;

const chatFiles = chatFilesCreator((_) => {});

class Host extends Component {
  // Initialize the state
  constructor(props) {
    super(props);

    this.socket = SocketIO(baseURL);
    this.room = this.props.match.params.code;
    this.soundRef = React.createRef();

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
        playerUrl: `${baseProto}//${baseURL}/player/${
          this.props.match.params.code
        }/${password.replaceAll(" ", "%20")}`,
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
          <SoundPlayer socket={this.socket} ref={this.soundRef} />
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
        {this.renderSoundTrigger("S0_desert_ambience", "Start Desert Ambience", true)}
        <p>
          <em><i>(Join the Zoom call.)</i></em>
        </p>

        <h2>Check In</h2>
        <p>
          "Comm check, one two one two. Can you guys hear me?"
        </p>
        <h2>Introduction</h2>
        <p>"Hi, I’m Alex from aliensarereal.net."</p>
        <p>Greet each hacker on Zoom, and then ramble about the following:</p>
        <ul>
          <li>finally meeting the hackers</li>
          <li>thinking no one was gonna help</li>
          <li>planning this mission nonstop for 2 years</li>
          <li>people thinking you've gone mad</li>
        </ul>
        <p>
          "But, joke’s on them, right? ‘Cause today it’s finally happening. Today, we’re going to uncover the secret the government has been hiding from us for way too long:
          ALIENS!"
        </p>
        
        <h2>The Desert</h2>
        <p>Fill the hackers in, and set the scene:</p>
        <ul>
          <li>you flew from JFK to Vegas several hours ago, and then drove out to the coordinates for Area 51</li>
          <li>it's pretty empty — wind, road, lots of sand</li>
          <li>anything else you can imagine (e.g. tourist stops with alien-branded t-shirts, camper vans, billboards, etc.)</li>
        </ul>
        <h2>Virtual Desktops</h2>
        <p>
          "Anyway, where was I? Ah, yes. Three things on my list... <i>(checks piece of paper)</i> Number one, virtual desktops.
          OK, let’s get you guys set up with the virtual desktops."
        </p>
        <ul>
          <li>you developed these custom systems for the mission</li>
          <li>you're gonna put the link in the Zoom chat</li>
          <li>hackers can use any username</li>
          <li>they should message the Secure Chat once they're logged in</li>
        </ul>
        <button
          onClick={() => {
            navigator.clipboard.writeText(this.state.playerUrl);
          }}
        >
          Copy Player URL
        </button>
        <p>
          <strong>If the button doesn't work, copy the URL manually at the top right of the window.</strong>
        </p>
        <p>
          <em><i>(Wait for all hackers to send a message in the Secure Chat.)</i></em>
        </p>
        <h2>Backpack Contents</h2>
        <p>
          "Great. Number two, backpack. I’ve packed a backpack with gear we might need: a thermal camera, a small mirror, and a
          multi-tool. Actually, let me message you that list so you have a record."
        </p>
        <button
          onClick={() => {
            this.sendFile("backpack");
          }}
        >
          Send Backpack Contents
        </button>
        <h2>Reception</h2>
        <p>
          "Number three... uh, hold on, my reception’s starting to get spotty... I’m gonna need to turn off my video to save
          bandwidth. I’ll be sure to keep you in the loop with pictures."
        </p>
        <p>
          <em><i>(Turn off your video.)</i></em>
        </p>
        {this.renderSoundTrigger("S0_walk", "Start Walking", true)}
        <h2>The Plan</h2>
        <p>
          "OK, number three: the plan. My findings point to a top secret room that’s managed to evade all government records.
          No one but the most essential employees can access it. They call it — “The Vault.” If we can somehow break in there,
          snag some documents, and get them out to the world, it'll be <span style={{"text-decoration": "underline"}}>big</span>!"
        </p>
        <p>
          "My research has revealed that the computers in Area 51 are all connected to the local network. Once we locate an access
          point to the network, I’ll attach a wireless transmitter that’ll grant you access to the filesystem. I’ll then need
          you to use the files in there to help guide me through Area 51 and to The Vault. You got that?"
        </p>
        <p>
          <i><em>(Hackers respond affirmatively.)</em></i>
        </p>
        <p>
          "Great. So if I did my research correctly, I believe the entrance to Area 51 is right in here."
        </p>
        <button
          onClick={() => {
            this.sendFile("warehouse");
          }}
        >
          Send Warehouse Exterior Image
        </button>
        <p>"Bam. Big, old, abandoned warehouse. The perfect front to Area 51 right?"</p>

        {this.renderSoundTrigger("S0_trip_alarm", "Walk and Trip Alarm", true)}

        "Looking for the entrance... found it. Let’s go."

        <h2>Trip Alarm</h2>
        <p>
          "Ow! I didn’t see that wire."
        </p>
        <ul>
          <li>You notice something blinking red on the ground. It says: 60:00, 59:59... </li>
          <li>It's an alarm, and it's counting down to a total lockdown!</li>
          <li>There's a timer on the virtual desktops. Use that to keep track.</li>
        </ul>
        <button
          onClick={() => {
            this.socket.emit("start-time", { room: this.room });
            /*
              This is an example of playing a sound in a button.
              This is good for playing sounds that need to be timed with the actor,
              like opening the electrical box.

              General background noise should be move to soundForState.js

              this.globalPlaySound("ambience");
            */
            this.globalStopSound("S0_desert_ambience");
          }}
          className="state"
        >
          Start Timer
        </button>
      </>
    );
  };

  maybeRenderP1A = () => {
    return (
      <>
        <h2>It's Dark In Here</h2>
        <p>
          <i>"(with greater urgency)</i> Alright, I’m in the warehouse. We’re looking for an access point and a hidden entryway to Area 51. It’s dark in here, I don’t know where to start looking. Do you see anything in this picture?"
        </p>
        <button
          onClick={() => {
            this.sendFile("no_thermal_warehouse");
          }}
        >
          Send Warehouse Image (Dark)
        </button>
        <p><i>(The hackers will likely ask you to explore the warehouse. Throughout the scene, use the following sounds to walk around. As you explore, describe what you see. There should be nothing fruitful.)</i></p>

        {this.renderSoundTrigger("S1_walk_1", "Walk Around 1", true)}
        {this.renderSoundTrigger("S1_walk_2", "Walk Around 2", true)}
        {this.renderSoundTrigger("S1_walk_3", "Walk Around 3", true)}
        <p>
          <em><i>(The hackers should eventually ask you to use your thermal camera.)</i></em>
        </p>
        <h2>Thermal Camera</h2>
        <p>
          "Oh yes! Good call. I’ll get that out now and take a picture, gimme a sec."
        </p>
        {this.renderSoundTrigger("S1_get_camera", "Get Camera from Backpack", true)}
        <button
          onClick={() => {
            this.sendFile("thermal_warehouse");
          }}
        >
          Send Thermal Warehouse Image (Power Off)
        </button>
        <h2>Electrical Box</h2>
        <p>
          <em><i>(The hackers should comment on the mysterious metal box on the back wall, with glowing wires leading into it.)</i></em>
        </p>
        {this.renderSoundTrigger("S1_walk_to_box", "Walk to Electrical Box", true)}
        <p>"This looks like an electrical box. <i>(beat)</i> It’s locked."</p>
        <p><em><i>(The hackers should suggest using your multitool.)</i></em></p>
        
        {this.renderSoundTrigger("S1_open_box", "Open Electrical Box", true)}
        <h2>Switch and Transmitter</h2>
        <p>
          "Got it open. It looks like there’s a power switch and an Ethernet port. It's an access point! I’m attaching the transmitter to the port. Let me know when you see the filesystem."
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 15,
            });
            this.globalPlaySound("S1_insert_plug");
          }}
          className="state"
        >
          Attach Filesystem
        </button>
        <p><strong>The Filesystem app appears. building_directory.pdf has been unlocked.</strong></p>
        <p>"Just as planned! We got the access point down. Now, where’s the hidden entryway?"</p>
        
        <p><em><i>(The hackers should tell you to flip the power switch.)</i></em></p>

        {this.renderSoundTrigger("S1_flip_switch_close_box", "Flip Switch and Close Box", true)}

        <p>"I can’t see any difference. What do you think it turned on?"</p>

        <p><em><i>(The hackers should ask for another thermal camera picture.)</i></em></p>

        <p>"Taking another right now. Do you see anything new?"</p>

        <button
          onClick={() => {
            this.sendFile("thermal_warehouse_wires");
          }}
        >
          Send Thermal Warehouse Image (Power On)
        </button>

        <p><em><i>(The hackers should comment that some wires have lit up, and they go to the right.)</i></em></p>

        <h2>Elevator</h2>
        <p>
          "To the right. Got it."
        </p>
         {this.renderSoundTrigger("S1_walk_to_elevator", "Walk to Elevator", true)}
        <p>
          "It’s a really dirty wall."
        </p>
        {this.renderSoundTrigger("S1_brush_buttons", "Brush Off Buttons", true)}
        <p>
          "Oh, there’s a button!"
        </p>
        {this.renderSoundTrigger("S1_call_elevator", "Call Elevator", true)}
        <p>
          "It’s here. Let’s go!"
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 20,
            });
          }}
          className="complete"
        >
          Move to Elevator
        </button>
      </>
    );
  };

  maybeRenderP1B() {
    return (
      <>
        <h2>5 Buttons</h2>
        <p>
          "I’m in the elevator. It's really old and dirty, but functional, let's hope. I see 5 buttons, ground through sublevel 4. OK, team, pick one."
        </p>
        <p>
          <i>(Press the button for the floor the hackers suggest. When the very slow, creaky elevator finally arrives at the floor, describe what you see using the text that pops up.)</i>
        </p>
        <p>
          <em><i>(The hackers should ultimately ask for Sublevel 3.)</i></em>
        </p>
        <Elevator
          successCallback={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 29,
            });
          }}
          globalPlaySound={this.globalPlaySound}
          globalStopSound={this.globalStopSound}
        />

        {this.state.state >= 29 && (
          <>
            <h2>THE CORRECT FLOOR</h2>
            <p>"<i>(whisper)</i> I think this is it, guys. There are long hallways with tall ceilings and metal doors, and security cameras."</p>
            <button
              onClick={() => {
                this.socket.emit("setRoomState", {
                  roomCode: this.room,
                  state: 30,
                });
              }}
              className="complete"
            >
              Move to Next Scene
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
          Send Hallway Image
        </button>
        <h2>We Need A Plan</h2>
        <p>"We’re stuck here until we have a plan to get past these sensors. Is The Vault on this floor? Can you find a floor plan?</p>
        <p><strong>security_invoice.pdf and subfloor3.bp have been decrypted.</strong></p>

        <h2>Plotting the Sensors</h2>
        <p>
          <strong>
            subfloor3.bp and security_invoice.pdf have been unlocked.
          </strong>
        </p>
        <p>"Alright, send me the map when you’re done and I can check it against what I see here."</p>
        <p><em><i>(The hackers must figure out how to arrange the security sensors on the map. When they export their work, follow the line prompter to give feedback on the map.)</i></em></p>
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
            <h2>Responding to the Hackers</h2>
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
            <h2>Sensors Solved</h2>
            <p>"This looks right to me. Great job. I’m sharing my location with you."</p>
            <button
              onClick={() => {
                this.socket.emit("setRoomState", {
                  roomCode: this.room,
                  state: 40,
                });
              }}
              className="complete"
            >
              Share Location
            </button>
            <p><strong>
              Location indicator (blue dot) appears on the floor plan.
            </strong></p>
          </>
        )}
      </>
    );
  }

  maybeRenderP2B() {
    return (
      <>
        <h2>VIDEO STREAM</h2>
        <p>
          "I found this electrical panel nearby. Give me a minute to set up a video stream in case there's useful intel on the sensors."
        </p>
        {this.renderSoundTrigger("S4_setup_video", "Set Up Video Stream", true)}

        <button
          className="state"
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 45,
            });
          }}
        >
          Send Video Stream
        </button>

        <p><strong>
          Video Stream app appears.
        </strong></p>

        <p><i>
          (The hackers will need to decide among themselves who views the video stream and who views the floor plan as there is “not enough RAM” to view both.)
        </i></p>

        <p>
          "Done! Now we just gotta sneak our way past security and to The Vault. I’ll need you to take the lead and tell me where to go."
        </p>

        <h2>Navigating the Security</h2>
        <p>
          <em><i>(Follow the hackers’ instructions on when to move. Maintain tension and urgency as you go. Press the arrow keys to move.)</i></em>
        </p>
        <ul>
          <li><b>⚠️ Warning:</b> If you get a warning, make an excuse as to why you shouldn’t move — you see the red light on, etc.</li>
          <li><b>🪞 Lasers:</b> When you approach a laser, the hackers should tell you to use your mirror. Click “Slow for Lasers” to equip your mirror. You will not be able to get past the lasers without it.</li>
          <li><b>🚨 Red Flash:</b> The screen flashes red when you get caught. Panic, and say you are running back to the elevator to hide.</li>
        </ul>

        <ActorMoving
          socket={this.socket}
          room={this.room}
          level={this.state.state}
          globalPlaySound={this.globalPlaySound}
          globalStopSound={this.globalStopSound}
        />
        <p>
          <strong>
            The electrical panel corresponds with sensors in the floor plan.
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
          "<i>(Out of breath)</i> Whew, we made it to the door!"
        </p>
        <button
          onClick={() => {
            this.sendFile("vault_door");
          }}
        >
          Send Vault Door Image
        </button>
        <p>"This is it, we’re so close. The truth is right behind this door. We just gotta get it open—"</p>
        <h2>ID NUMBER AND PASSWORD</h2>
        <p>"—It’s locked! The screen, it’s asking for an ID number. Any idea what I should put in?"</p>
        <p><em><i>(Press the button that matches the hackers’ answer.)</i></em></p>

        <h2>Security Questions</h2>
        <p>"Ack, there’s a 30 second timer for security questions! We need to hurry."</p>
        <p>
          <em>
            <i>(For each prompt, read the question and press the key that matches the hackers’ answer.)</i>
          </em>
        </p>
        <VaultDoor socket={this.socket} room={this.room} globalPlaySound={this.globalPlaySound} globalStopSound={this.globalStopSound} />
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
        <h2>We're In</h2>
        <p>
          "And... we’re in. Shh— OK, I think we’re clear."
        </p>
        <p>
          <i>(Use the following sounds to walk around the lab throughout the scene.)</i>
        </p>

        {this.renderSoundTrigger("S6_walk_1", "Walk Around 1", true)}
        {this.renderSoundTrigger("S6_walk_2", "Walk Around 2", true)}
        {this.renderSoundTrigger("S6_walk_3", "Walk Around 3", true)}

        <p>
          "<i>(in awe)</i> Whoa. It’s a massive lab. It’s all dark and green in here. This is unreal, you guys. There are tall metal machines, cabinets full of notebooks, and racks of test tubes. Just like I’d imagined! <i>(beat)</i> But hold on... where are the aliens?! They’ll never believe us without proof."
        </p>

        <h2>Foreign Symbols</h2>
        <p>"Huh, that’s strange. All the writing around here is in foreign symbols. Take a look. Maybe that’s a lead."</p>

        <button
          onClick={() => {
            this.sendFile("cameras");
          }}
        >
          Send Cameras
        </button>

        <h2>Lab Computer</h2>
        <p>"I found the lab computer! There’s gotta be solid proof on here."</p>

        <button
          onClick={() => {
            this.sendFile("computer");
          }}
        >
          Send Computer
        </button>

        {this.renderSoundTrigger("S6_keyboard_1", "Type on Computer 1", true)}

        <p>
          "OK, just as I expected. This labstation is hidden from the local filesystem. I’ll dig around and see if I can find any suspicious documents. I’ll need your help in deciphering them to see if they're usable."
        </p>
        
        {this.renderSoundTrigger("S6_keyboard_2", "Type on Computer 2", true)}

        <p>
          "I found a directory named “CONFIDENTIAL.” Looks like there are two transcripts and a journal entry. Sending them now. Can you take a crack at them and let me know what they say?"
        </p>

        <button
          onClick={() => {
            this.sendFile("languageTranscript1");
          }}
          className="highlight"
        >
          Send Transcript 1
        </button>
        <button
          onClick={() => {
            this.sendFile("languageTranscript2");
          }}
          className="highlight"
        >
          Send Transcript 2
        </button>
        <button
          onClick={() => {
            this.sendFile("alienArticle");
          }}
          className="highlight"
        >
          Send Journal
        </button>

        <p><i>
          (The hackers will receive three documents in the Secure Chat. If they don’t notice the Translator app, pop it open for them.)
        </i></p>

        <button
          className="state"
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 65,
            });
          }}
        >
          Send Translator App
        </button>

        <p>"Thanks! In the meantime, I’ll keep looking around."</p>

        <h2>Continue Exploring</h2>

        <p>
        <i>(Continue walking around. Give feedback to the hackers if they submit their translation progress. Over time, send the below hint images to the hackers. As time runs low, remind them of the time and tell them to hurry up!)</i>
        </p>

        <p>"I found a discarded test tube with some powder left over in it."</p>

        <button
          onClick={() => {
            this.sendFile("powder");
          }}
        >
          Send Powder
        </button>

        <p>"Guys? This looks like a human brain. I’m a little creeped out..."</p>

        <button
          onClick={() => {
            this.sendFile("brain");
          }}
        >
          Send Brain
        </button>

        <h2>Getting Close</h2>

        <p><i>(Keep an eye on the Translator. When the hackers are about halfway done translating, play the radio message. This automatically plays at 5:00 if not played earlier.)</i></p>
      
        {this.renderSoundTrigger("S6_radio", "Play Radio Message", true)}

        <p>"Shh — did you guys hear that? They’re on their way."</p>

        <h2>For a <span style={{ "color": "#d71c4a", "text-decoration": "underline" }}>FAILURE</span> Ending:</h2>

        <p><i>(Let the timer run out or click “end show”. The failure sequence will automatically start playing at 0:00, and you will be redirected to the failure page.)
        </i></p>

        <h2>For a <span style={{ "color": "#1cc87b", "text-decoration": "underline" }}>SUCCESS</span> Ending:</h2>

        <p>
          <em>
            <i>
              (The players finish translating the journal and export the translation key to chat before 0:01. Scene continues below the Translator.)
            </i>
          </em>
        </p>

        <Translator socket={this.socket} host={true} />
        {60 <= this.state.state && this.state.state < 70 && (
          <>
            <h2>Responding to the Hackers</h2>
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
              "What is it? What does it say?"
            </p>
            <p>
              <em>
              <i>
                (The hackers tell you about, or read aloud, the contents of the translated journal: indeed, The Vault researchers are actually aliens conducting research on humans. You are in disbelief.)
              </i>
              </em>
            </p>
            <p>
              "What?! So you’re saying that Area 51 is actually aliens... researching us?! No way. I’ll email everything to the press right now. The New York Times, CNN, the Washington Post. We gotta get this out to the world! ...And I should get out of here. Is there an exit?"
            </p>
            
            {this.renderSoundTrigger("S6_walk_3", "Walk to Back Room", true)}

            <p>
              <i>
                (You walk into a back room, where you find a collection of creatures soaked in giant glass tubes.)
              </i>
            </p>

            <p>
              "Guys, look at this!"
            </p>

            <button
              onClick={() => {
                this.sendFile("tubes");
              }}
            >
              Send Tubes
            </button>

            <p>
              "Uh... yup, these don’t look like aliens..."
            </p>
            
            <button
              onClick={() => {
                this.sendFile("subject1");
                this.sendFile("subject2");
                this.globalPlaySound("S6_jump_scare");
              }}
            >
              Send Subjects
            </button>
            
            <h2>The Frantic Escape</h2>

            <p>
              <i>
                (Right then, the FBI arrives and starts banging on the door, demanding you to open up before they shoot the door down.)
              </i>
            </p>

            { this.renderSoundTrigger("S6_success", "Play Success Sequence", true) }

            <p>
              "Shit. They’re here! I gotta get out before they see me. Is there an exit?"
            </p>
                    
            <p>
              <i>
                (You grab some papers and start searching for an exit. You find one in the back and break out of the lab just as gunshots begin.)
              </i>
            </p>

            <p>
              <i>
                (You pant as you run up the stairs. Once you reach the top, catch your breath and address the hackers one last time.)
              </i>
            </p>

            <p>
              "Whew, I made it out! That was a close one. Sending that email right now. I gotta get back to my car ASAP and get on the road before they catch me."
            </p>

            <p>
              "Thanks so much for all your help on this mission! You guys really are brilliant hackers, I couldn’t have done it without you."
            </p>

            <p>
              "I hope we’ll stay in touch and meet out in the world someday. Until then, we can now say, ALIENS ARE REAL! WOOHOO!"
            </p>

            <p>
              <em>
                <i>
                  (Leave the Zoom call.)
                </i>
              </em>
            </p>

            <button
              onClick={() => {
                this.socket.emit("startRoomSuccess", {
                  roomCode: this.room,
                });
              }}
              className="complete"
            >
              Send the Email
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
              <em><i>(Rejoin the call and turn your video back on.)</i></em>
            </p>
            <h2>Post-Mission Debrief</h2>
            <p>Congratulate the players for a successful mission!</p>
            <ul>
              <li><b>📸 Photo Op:</b> Have the players download the virtual background <a href="/ending-bgs/success.jpg" target="_blank">here</a>. When everyone has changed their backgrounds, take a team photo/screenshot. Share the file to the #photos channel on Discord!
              </li>
              <li><b>📥 Feedback:</b> Chat with the players and answer any questions they may have about the puzzles/experience. Encourage them to fill out the feedback form! (Linked in the last email from Alex)</li>
              <li><b>🧩 Recap:</b> Briefly step through and recap each puzzle solution in the experience. To do this, ask a player to screen share and walk them through the solutions.</li>
            </ul>
            <h2 className="center">END OF SHOW</h2>
          </>
        )}
      </>
    );
  }

  maybeRenderFailure() {
    return (
      <>
        <h2>FBI ARRIVES</h2>
        <p><i>(The FBI arrives and starts banging on the door, demanding you to open up before they shoot the door down.)
        </i></p>

        <p>"Shit. They’re here! I gotta get out of here before they see me. Is there an exit?"
        </p>
        
        <p><i>(You try to find an exit and fail. The FBI shoots the door down, and you are captured.)
        </i></p>

        <p><em><i>(Stay on until the sound stops, then leave the Zoom call.)</i></em></p>

        <p>
          <em><i>(After 10-20 seconds, rejoin the call and turn your video back on.)</i></em>
        </p>

        <button
          className="warning"
          onClick={() => {
            this.globalStopSound("S6_radio");
            this.globalStopSound("S6_vault_ambience");
          }}
        >
          Stop All Sound
        </button>

        <h2>Post-Mission Debrief</h2>
        <p>Break the news to the players (Alex has been captured by the FBI).</p>
        <ul>
          <li><b>📸 Photo Op:</b> Have the players download the virtual background <a href="/ending-bgs/failure.jpg" target="_blank">here</a>. When everyone has changed their backgrounds, take a team photo/screenshot. Share the file to the #photos channel on Discord!
          </li>
          <li><b>📥 Feedback:</b> Chat with the players and answer any questions they may have about the puzzles/experience. Encourage them to fill out the feedback form! (Linked in the last email from Alex)</li>
          <li><b>🧩 Recap:</b> Briefly step through and recap each puzzle solution in the experience. To do this, ask a player to screen share and walk them through the solutions.</li>
        </ul>

        <h2 className="center">END OF SHOW<br/><br/>--</h2>

        <h2>1. Abandoned Warehouse</h2>
        <p>
          Hackers should have used the thermal camera image to guide you to the
          electrical box and Elevator.
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 10,
            });
          }}
        >
          Go to Warehouse
        </button>
        <h2>2. Old Elevator</h2>
        <p>Hackers should have used the Floor Directory to pick Sublevel 3.</p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 20,
            });
          }}
        >
          Go to Elevator
        </button>
        <h2>3. Hiding In Hallways</h2>
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
        >
          Go to Hallway
        </button>
        <h2>4. Navigating Hallways</h2>
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
        >
          Go to Door
        </button>
        <h2>6. Inside the Vault</h2>
        <p>
          Hackers should translate the Journal entry using the interview
          transcripts.
        </p>
        <button
          onClick={() => {
            this.socket.emit("setRoomState", {
              roomCode: this.room,
              state: 60,
            });
          }}
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

  playSound = (soundId) => {
    if (this.soundRef && this.soundRef.current) {
      this.soundRef.current.playSound(soundId);
    }
  };

  globalPlaySound = (soundId) => {
    console.log("GLOBAL", soundId);
    this.socket.emit("globalPlaySound", { roomCode: this.room, soundId });
  };
  globalStopSound = (soundId) => {
    this.socket.emit("globalStopSound", { roomCode: this.room, soundId });
  };

  renderSoundTrigger = (soundId, soundName, stoppable) => {
    return (
      <ActorSoundTrigger
        socket={this.socket}
        soundId={soundId}
        soundName={soundName}
        stoppable={stoppable}
        playSound={this.globalPlaySound}
        stopSound={this.globalStopSound}
      />
    );
  };

  renderChat() {
    return (
      <Chat
        room={this.room}
        viewer="@lex"
        chatColor={this.state.chatColor}
        files={chatFiles}
        socket={this.socket}
        playSound={this.playSound}
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
