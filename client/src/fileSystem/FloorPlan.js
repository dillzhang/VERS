import React, { Component } from 'react';

import './FloorPlan.css';

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
]

const laserPairs = [
    [4, 5],
    [8, 9],
    [15, 16],
    [19,20],
    [0, 21],
]
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

class FloorPlan extends Component {
    constructor(props) {
        super(props);

        this.floorPlanRef = React.createRef();
        this.prevX = -1;
        this.prevY = -1;

        this.state = {
            sensors: [...Array(22)].map(_ => -1),
            near: [...Array(22)].map(_ => false),
            dragging: -1,
            dragX: -1,
            dragY: -1,
        }
    }

    handleMouseMove = (e) => {
        if (this.state.dragging >= 0) {
            const dx = e.pageX - this.prevX;
            const dy = e.pageY - this.prevY;
            this.prevX = e.pageX;
            this.prevY = e.pageY;

            const best = sensorLocations.map((location, index) => {
                return [(this.state.dragX + 15 - location[0]) ** 2 + (this.state.dragY + 15 - location[1]) ** 2, index];
            }).filter(
                distance => distance[0] < 225
            ).sort(
                (a, b) => a[0] - b[0]
            );
            const near = this.state.near.map((_, i) => best.length > 0 && i == best[0][1])
            this.setState(state => ({
                dragX: state.dragX + dx,
                dragY: state.dragY + dy,
                near,
            }));
        }
    }

    handleMouseUp = (e) => {
        if (this.state.dragging >= 0) {
            const sensors = this.state.sensors.map((v, i) => this.state.near[i] ? this.state.dragging : v);
            const near = this.state.near.map((_) => false);
            this.setState(state => ({
                dragging: -1,
                sensors,
                near,
            }));
        }
    }

    componentDidMount() {
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    render() {
        return (
            <div className="floor-planner" ref={this.floorPlanRef}>
                <div className="sensor-container">
                    <div className="hiding-container">
                        {laserPairs.map((pair, index) => {
                            if (this.state.sensors[pair[0]] === 2 && this.state.sensors[pair[1]] === 2) {
                                return (
                                    <div 
                                        key={`laser-${index}`} 
                                        className={`laser-line laser-${index}`} 
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
                                    className={`sensor sensor-direction-${location[2]} ${this.state.near[index] ? "near" : `sensor-type-${sensors[this.state.sensors[index]].class}`}`} 
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="floor-plan" />
                <div className="controls">
                    <div className="sensor-source">
                        <div 
                            className="sensor-sample sample-camera"
                            onMouseDown={(e) => {
                                const {x, y} = e.target.getBoundingClientRect();
                                this.prevX = e.nativeEvent.pageX;
                                this.prevY = e.nativeEvent.pageY;
                                this.setState({
                                    dragging: 0,
                                    dragX: x - this.floorPlanRef.current.getBoundingClientRect().x,
                                    dragY: y - this.floorPlanRef.current.getBoundingClientRect().y,
                                })
                            }}
                        />
                        Camera
                    </div>
                    <div className="sensor-source">
                        <div 
                            className="sensor-sample sample-motion"
                            onMouseDown={(e) => {
                                const {x, y} = e.target.getBoundingClientRect();
                                this.prevX = e.nativeEvent.pageX;
                                this.prevY = e.nativeEvent.pageY;
                                this.setState({
                                    dragging: 1,
                                    dragX: x - this.floorPlanRef.current.getBoundingClientRect().x,
                                    dragY: y - this.floorPlanRef.current.getBoundingClientRect().y,
                                })
                            }}
                        />
                        Motion Sensor
                    </div>
                    <div className="sensor-source">
                        <div 
                            className="sensor-sample sample-laser"
                            onMouseDown={(e) => {
                                const {x, y} = e.target.getBoundingClientRect();
                                this.prevX = e.nativeEvent.pageX;
                                this.prevY = e.nativeEvent.pageY;
                                this.setState({
                                    dragging: 2,
                                    dragX: x - this.floorPlanRef.current.getBoundingClientRect().x,
                                    dragY: y - this.floorPlanRef.current.getBoundingClientRect().y,
                                })
                            }}
                        />
                        Laser Trip Wire
                    </div>
                    <button className="export" onClick={(e) => {
                        e.target.disabled = true;
                        this.props.socket.emit("floor-plan", {
                            // roomCode, io, sender, color, sensors
                            roomCode: this.props.roomCode,
                            sender: this.props.sender,
                            color: this.props.color,
                            sensors: this.state.sensors,
                        });
                        const button = e.target;
                        setTimeout(() => {
                            button.disabled = false;
                        }, 1000);
                    }}>
                        Export to Chat
                    </button>
                </div>
                {this.state.dragging > -1 && (
                    <div 
                        key="draggingSensor"
                        style={{top: this.state.dragY, left: this.state.dragX}}
                        className={`dragging-sensor sensor-drag-${sensors[this.state.dragging].class}`}
                    />
                )}
            </div>
        )
    }
}

export default FloorPlan