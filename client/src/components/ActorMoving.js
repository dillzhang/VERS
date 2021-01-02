import React, { Component } from "react";

import "../fileSystem/FloorPlan.css";

const directions = {
  up: [-1, 0],
  left: [0, -1],
  right: [0, 1],
  down: [1, 0],
};

const arrows = {
  up: "↑",
  left: "←",
  right: "→",
  down: "↓",
};

const laserPairs = [
  [4, 5],
  [8, 9],
  [15, 16],
  [19, 20],
  [0, 21],
];
const sensorLocations = [
  [30, 6, 4],
  [570, 6, 4],
  [660, 60, 1],
  [60, 90, 6],
  [120, 90, 2],
  [480, 90, 6],
  [180, 120, 1],
  [330, 180, 4],
  [6, 210, 2],
  [714, 210, 6],
  [450, 240, 0],
  [690, 240, 0],
  [480, 270, 2],
  [300, 300, 3],
  [60, 330, 6],
  [180, 330, 2],
  [360, 330, 6],
  [540, 420, 5],
  [240, 450, 6],
  [480, 450, 2],
  [714, 450, 6],
  [30, 474, 0],
];
const sensors = {
  "-1": {
    class: "undeclared",
  },
  0: {
    class: "camera",
  },
  1: {
    class: "motion",
  },
  2: {
    class: "laser",
  },
};
const correctSensors = [
  2,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  2,
  2,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  2,
];
const floorplan = [
  // 0
  [
    ["Laser Trip Wire"],
    [],
    [],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    [],
    [],
    ["A10"],
    ["Motion Sensor"],
    ["Motion Sensor"],
  ],
  // 1
  [
    ["Laser Trip Wire", "B1"],
    ["Wall"],
    ["Motion Sensor", "B3"],
    ["Motion Sensor", "B3"],
    [],
    [],
    ["B9"],
    ["B9"],
    ["Wall"],
    ["A10"],
    ["Wall"],
    ["Motion Sensor"],
  ],
  // 2
  [
    ["Laser Trip Wire"],
    ["Wall"],
    ["Wall"],
    ["Motion Sensor"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    [],
    ["Wall"],
    ["E12"],
  ],
  // 3
  [
    ["Laser Trip Wire"],
    ["Laser Trip Wire"],
    ["Laser Trip Wire"],
    ["Laser Trip Wire"],
    ["Laser Trip Wire"],
    ["Laser Trip Wire", "D6"],
    ["Laser Trip Wire"],
    ["Laser Trip Wire", "E8"],
    ["Laser Trip Wire"],
    ["Laser Trip Wire"],
    ["Laser Trip Wire"],
    ["Laser Trip Wire", "E12"],
  ],
  // 4
  [
    ["Laser Trip Wire"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Motion Sensor", "D6"],
    ["Wall"],
    ["Wall"],
    ["E9"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
  ],
  // 5
  [
    ["Laser Trip Wire", "G1"],
    ["Wall"],
    ["Wall"],
    ["G4"],
    ["Motion Sensor", "G4", "G7"],
    ["Motion Sensor", "G7"],
    ["Wall"],
    ["Wall"],
    [],
    ["Wall"],
    ["Wall"],
    ["Wall"],
  ],
  // 6
  [
    ["Laser Trip Wire"],
    ["Wall"],
    ["Wall"],
    [],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Motion Sensor"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
  ],
  // 7
  [
    ["Laser Trip Wire"],
    [],
    ["L5"],
    ["L5"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Wall"],
    ["Motion Sensor", "L9"],
    ["Motion Sensor", "L9"],
    ["L12"],
    ["L12"],
  ],
];

const sensorOrder = [
  "A1",
  "A10",
  "B12",
  "B1",
  "B3",
  "B9",
  "C4",
  "D6",
  "D1",
  "D12",
  "E8",
  "E12",
  "E9",
  "F6",
  "G1",
  "G4",
  "G7",
  "L10",
  "L5",
  "L9",
  "L12",
  "L1",
];

const path = ["B9", "A10", "E8", "D6", "G1", "L5"];

class ActorMoving extends Component {
  constructor(props) {
    super(props);
    this.pathIndex = 5;

    this.warnings = 0;

    this.state = {
      sensors: {
        A1: true,
        A3: true, // Always
        A4: true, // Always
        A10: true,
        B1: true,
        B3: true,
        B9: true,
        B12: true,
        C4: true,
        C5: false, // Always
        C9: false, // Always
        C13: true, // Always
        D1: true,
        D6: true,
        D12: true,
        D14: true, // Always
        E8: true,
        E9: true,
        E11: false, // Always
        E12: true,
        F6: true,
        G1: true,
        G4: true,
        G7: true,
        L1: true,
        L5: true,
        L9: true,
        L10: true,
        L12: true,
        M2: true, // Always
        M6: true, // Always
        M11: true, // Always
      },
      location: {
        xcor: 4,
        ycor: 1,
      },

      message: "Ready to go!",
    };
  }

  updateSensors = () => {
    let failed = false;
    const currentSensorState = this.state.sensors;

    currentSensorState[path[this.pathIndex]] = true;

    failed =
      floorplan[this.state.location.ycor][this.state.location.xcor].indexOf(
        path[this.pathIndex]
      ) > -1;
    this.pathIndex = (this.pathIndex + 1) % path.length;
    currentSensorState[path[this.pathIndex]] = false;

    if (this.lastRandom) {
      currentSensorState[this.lastRandom] = true;
      failed =
        failed ||
        floorplan[this.state.location.ycor][this.state.location.xcor].indexOf(
          this.lastRandom
        ) > -1;
    }
    this.lastRandom = Object.keys(currentSensorState)
      .filter((s) => currentSensorState[s] && path.indexOf(s) > -1)
      .sort((a, b) => Math.random() - 0.5)
      .pop();
    currentSensorState[this.lastRandom] = false;

    this.props.socket.emit("electricalUpdate", {
      state: currentSensorState,
      room: this.props.room,
    });

    if (failed) {
      this.props.socket.emit("locationUpdate", {
        red: true,
        location: this.state.location,
        room: this.props.room,
      });
      this.setState({
        red: true,
        message:
          "Oh no! The camera turned back on. I need to evade the guards. I will contact when I can.",
      });
      setTimeout(() => {
        this.setState(
          (state) => ({
            location: {
              xcor: 4,
              ycor: 1,
            },
            red: false,
            message: "I'm back at the elevator and ready to go!",
          }),
          () => {
            this.warnings = 0;
            this.props.socket.emit("locationUpdate", {
              red: false,
              location: this.state.location,
              room: this.props.room,
            });
          }
        );
      }, 10 * 1000);
    }
    this.setState({ sensors: currentSensorState });
    this.timeOutId = setTimeout(this.updateSensors, 10 * 1000);
  };

  componentDidMount() {
    this.updateSensors();
  }

  componentWillUnmount() {
    clearTimeout(this.timeOutId);
  }

  canMove = (dir) => {
    const [dy, dx] = directions[dir];
    const nextX = this.state.location.xcor + dx;
    const nextY = this.state.location.ycor + dy;
    return (
      floorplan[nextY] &&
      floorplan[nextY][nextX] &&
      floorplan[nextY][nextX].indexOf("Wall") === -1
    );
  };

  move = (dir) => {
    const [dy, dx] = directions[dir];

    const dangers = floorplan[this.state.location.ycor + dy][
      this.state.location.xcor + dx
    ].filter((d) => {
      switch (d) {
        case "Laser Trip Wire":
          return this.state.useMirror ? false : true;
        case "Motion Sensor":
          return true;
        default:
          return this.state.sensors[d];
      }
    });

    if (dangers.length > 0 && this.warnings < 3) {
      this.warnings += 1;
      this.setState({
        message:
          dangers.indexOf("Motion Sensor") > -1
            ? "There seems to be a motion sensor on the corner."
            : dangers.indexOf("Laser Trip Wire") > -1
            ? "Are there any lasers I need to worry about?"
            : "The camera looks like its still recording.",
      });
      return;
    } else if (dangers.length > 0) {
      this.props.socket.emit("locationUpdate", {
        red: true,
        location: this.state.location,
        room: this.props.room,
      });
      this.setState({
        red: true,
        message:
          dangers.indexOf("Motion Sensor") > -1
            ? "We were caught on a motion sensor.  I need to evade the guards. I will reach back to you soon."
            : dangers.indexOf("Laser Trip Wire") > -1
            ? "We crossed a laser trip wire. I need to evade the guards. I will reach back to you soon."
            : "We were caught on camera. I need to evade the guards. I will reach back to you soon.",
      });
      setTimeout(() => {
        this.setState(
          (state) => ({
            location: {
              xcor: 4,
              ycor: 1,
            },
            red: false,
            message: "I'm back at the elevator and ready to go!",
          }),
          () => {
            this.warnings = 0;
            this.props.socket.emit("locationUpdate", {
              red: false,
              location: this.state.location,
              room: this.props.room,
            });
          }
        );
      }, 10 * 1000);

      return;
    }
    this.setState(
      (state) => ({
        location: {
          xcor: state.location.xcor + dx,
          ycor: state.location.ycor + dy,
        },
        message: "I'm moving!",
        moving: true,
      }),
      () => {
        setTimeout(
          () => {
            this.setState({ moving: false });
            if (
              this.state.location.xcor === 3 &&
              this.state.location.ycor === 6
            ) {
              clearTimeout(this.timeOutId);
              this.props.socket.emit("setRoomState", {
                roomCode: this.props.room,
                state: 50,
              });
            }
          },
          this.state.useMirror ? 750 : 250
        );
        this.props.socket.emit("locationUpdate", {
          red: false,
          location: this.state.location,
          room: this.props.room,
        });
      }
    );
  };

  handleKeyDown = (e) => {
    if (e.key === "ArrowUp" && this.canMove("up")) {
      this.move("up");
      e.preventDefault();
    } else if (e.key === "ArrowRight" && this.canMove("right")) {
      this.move("right");
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && this.canMove("left")) {
      this.move("left");
      e.preventDefault();
    } else if (e.key === "ArrowDown" && this.canMove("down")) {
      this.move("down");
      e.preventDefault();
    } else if (e.key === " ") {
      this.setState((state) => ({
        useMirror: !state.useMirror,
      }));
      e.preventDefault();
    }
  };

  render() {
    const style = {
      top: this.state.location.ycor * 60 + 20,
      left: this.state.location.xcor * 60 + 20,
    };
    const sensorStatus = sensorOrder.map(
      (key) =>
        !this.state.sensors.hasOwnProperty(key) || this.state.sensors[key]
    );
    return (
      <div
        className="floor-planner"
        ref={this.floorPlanRef}
        onKeyDown={this.handleKeyDown}
        tabIndex="0"
      >
        <div className="sensor-container">
          <div
            className={`hiding-container ${this.state.red ? "red-alert" : ""}`}
          >
            {!this.state.red && (
              <div
                className={`alex-location ${
                  this.state.useMirror ? "laser" : ""
                }`}
                style={style}
              />
            )}
            {laserPairs.map((pair, index) => {
              if (
                correctSensors[pair[0]] === 2 &&
                correctSensors[pair[1]] === 2
              ) {
                return (
                  <div
                    key={`laser-${index}`}
                    className={`laser-line laser-${index} ${
                      this.state.useMirror ? "deactivated" : ""
                    }`}
                  />
                );
              } else {
                return null;
              }
            })}
            {sensorLocations.map((location, index) => {
              const style = { left: location[0], top: location[1] };
              return (
                <div
                  key={`sensor-${index}`}
                  style={style}
                  className={`sensor sensor-direction-${location[2]} ${
                    sensorStatus[index] || correctSensors[index] !== 0
                      ? `sensor-type-${sensors[correctSensors[index]].class}`
                      : ""
                  }`}
                />
              );
            })}
          </div>
        </div>
        <div className="floor-plan" />

        <div className="actor-moving-controls">
          <div className="d-pad">
            {Object.keys(directions).map((dir) => {
              return (
                <button
                  key={dir}
                  className={dir}
                  onClick={() => {
                    if (
                      !this.state.red &&
                      !this.state.moving &&
                      this.canMove(dir)
                    )
                      this.move(dir);
                  }}
                  disabled={
                    this.state.red || this.state.moving || !this.canMove(dir)
                  }
                >
                  {arrows[dir]}
                </button>
              );
            })}
          </div>
          <div className="mirror-holder">
            <button
              onClick={() => {
                this.setState((state) => ({
                  useMirror: !state.useMirror,
                }));
              }}
            >
              {this.state.useMirror ? "Move Quickly" : "Slow for Lasers"}
            </button>
          </div>
        </div>
        <p className="message">Warnings: {this.warnings} / 3</p>
        <p className="message">Status: {this.state.message}</p>
      </div>
    );
  }
}

export default ActorMoving;
