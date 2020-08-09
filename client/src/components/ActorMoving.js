import React, { Component } from 'react';

import '../fileSystem/FloorPlan.css';

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

const path = ["B9", "A10", "E8", "D6", "G1", "L5"];

class ActorMoving extends Component {

    constructor(props) {
        super(props);
        this.pathIndex = 5;

        this.sensors = {
            A1: true,
            A3: false, // Always
            A4: false, // Always
            A10: true,
            B1: true,
            B3: true,
            B9: true,
            B12: true,
            C4: true,
            C5: false, // Always
            C9: false, // Always
            D1: true,
            D6: true,
            D12: true,
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
        },

        this.warnings = 0;
        
        this.state = {
            location: {
                xcor: 4,
                ycor: 1,
            },
            
            message: "Ready to go!",
        }
    }

    updateSensors = () => {
        let failed = false;

        this.sensors[path[this.pathIndex]] = true;

        failed = floorplan[this.state.location.ycor][this.state.location.xcor].indexOf(path[this.pathIndex]) > -1; 
        this.pathIndex = (this.pathIndex + 1) % path.length;
        this.sensors[path[this.pathIndex]] = false;
        
        if (this.lastRandom) {
            this.sensors[this.lastRandom] = true;
            failed = failed || floorplan[this.state.location.ycor][this.state.location.xcor].indexOf(this.lastRandom) > -1; 
        }
        this.lastRandom = Object.keys(this.sensors)
            .filter(s => this.sensors[s] && path.indexOf(s) > -1)
            .sort((a, b) => Math.random() - 0.5)
            .pop();
        this.sensors[this.lastRandom] = false;

        this.props.socket.emit("electricalUpdate", {state: this.sensors, room: this.props.room});

        if (failed) {
            this.props.socket.emit("locationUpdate", {red: true, location: this.state.location, room: this.props.room});
            this.setState({
                red: true,
                message: "Oh no! The camera turned back on. I need to evade the guards. I will contact when I can."
            });
            setTimeout(() => {
                this.setState(state => ({    
                    location: {
                        xcor: 4,
                        ycor: 1,
                    },
                    red: false,
                    message: "I'm back at the elevator and ready to go!"
                }), () => {
                    this.warnings = 0;
                    this.props.socket.emit("locationUpdate", {red: false, location: this.state.location, room: this.props.room});
                });
            }, 10 * 1000);
        }

        this.timeOutId = setTimeout(this.updateSensors, 10 * 1000);
    }

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
        return floorplan[nextY] && floorplan[nextY][nextX] && floorplan[nextY][nextX].indexOf("Wall") === -1;
    }
    
    move = (dir) => {
        const [dy, dx] = directions[dir];

        const dangers = floorplan[this.state.location.ycor + dy][this.state.location.xcor + dx].filter(d => {
            switch (d) {
                case "Laser Trip Wire":
                    return false;
                case "Motion Sensor":
                    return true;
                default:
                    return this.sensors[d];
            }
        });

        if (dangers.length > 0 && this.warnings < 3) {
            this.warnings += 1;
            this.setState({
                message: dangers.indexOf("Motion Sensor") > -1 ? "There seems to be a motion sensor on the corner." : "The camera looks like its still recording",
            });
            return;
        } else if (dangers.length > 0) {
            this.props.socket.emit("locationUpdate", {red: true, location: this.state.location, room: this.props.room});
            this.setState({
                red: true,
                message: dangers.indexOf("Motion Sensor") > -1 ? 
                    "We were caught on a motion sensor.  I need to evade the guards. I will reach back to you soon." : 
                    "We were caught on camera. I need to evade the guards. I will reach back to you soon.",
            });
            setTimeout(() => {
                this.setState(state => ({    
                    location: {
                        xcor: 4,
                        ycor: 1,
                    },
                    red: false,
                    message: "I'm back at the elevator and ready to go!"
                }), () => {
                    this.warnings = 0;
                    this.props.socket.emit("locationUpdate", {red: false, location: this.state.location, room: this.props.room});
                });
            }, 10 * 1000);

            return;
        }
        this.setState(state => ({    
            location: {
                xcor: state.location.xcor + dx,
                ycor: state.location.ycor + dy,
            },
            message: "I'm moving!",
            moving: true,
        }), () => {
            setTimeout(() => {
                this.setState({moving: false});
                if (this.state.location.xcor === 3 && this.state.location.ycor === 6) {
                    clearTimeout(this.timeOutId);
                    this.props.socket.emit("setRoomState", {roomCode: this.props.room, state: 50});
                }
            }, 500);
            this.props.socket.emit("locationUpdate", {red: false, location: this.state.location, room: this.props.room});
        });

    }

    render() {
        const style = {
            top: this.state.location.ycor * 60 + 20, 
            left: this.state.location.xcor * 60 + 20, 
        }
        return (
            <div className="floor-planner" ref={this.floorPlanRef}>
                <div className="sensor-container">
                    <div className={`hiding-container ${this.state.red ? "red-alert" : ""}`}>
                        {!this.state.red && <div className="alex-location" style={style} />}
                    </div>
                </div>
                <div className="floor-plan" />

                <div className="controls d-pad">
                    <div className="message">
                        {this.state.message} (Warnings Given {this.warnings} / 3)
                    </div>
                    {Object.keys(directions).map(dir => {
                        if (!this.state.red && !this.state.moving && this.canMove(dir)) {
                            return <button key={dir} className={dir} onClick={() => {this.move(dir)}}>{arrows[dir]}</button>;
                        }
                        return <div key={dir} className={`${dir} disabled`}>{arrows[dir]}</div>;
                    })}
                </div>
            </div>
        )
    }
}

export default ActorMoving;