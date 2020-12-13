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
        if (this.props.level >= 40) {
            this.state = {
                interactivity: false,
                sensors: [ 2, 0, 1, 0, 0, 0, 1, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2 ],
                near: [...Array(22)].map(_ => false),
                dragging: -1,
                dragX: -1,
                part2: true,
                location: {
                    xcor: 4,
                    ycor: 1,
                },
                dragY: -1,
                holdingShift: false,
            };
        } else {
            this.state = {
                sensors: [...Array(22)].map(_ => -1),
                near: [...Array(22)].map(_ => false),
                dragging: -1,
                dragX: -1,
                dragY: -1,
                interactivity: true,
                holdingShift: false,
            }
        }

        this.props.socket.on("roomStateUpdate", ({state}) => {
            if (state === 40) {
                this.setState({
                    interactivity: false,
                    sensors: [ 2, 0, 1, 0, 0, 0, 1, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2 ],
                    near: [...Array(22)].map(_ => false),
                    dragging: -1,
                    dragX: -1,
                    dragY: -1,
                    part2: true,
                    location: {
                        xcor: 4,
                        ycor: 1,
                    },
                    holdingShift: false,
                });
            }
        });

        this.props.socket.on("sensorUpdate", ({sensors}) => {
            this.setState({
                sensors,
            });
        });

        this.props.socket.on("locationUpdate", ({red, location}) => {
            this.setState({location, red})
        });

        
        this.xoffset = 120;
    }
    handleMouseMove = (e) => {
        if (this.state.interactivity && this.state.dragging >= 0) {
            const dx = e.pageX - this.prevX;
            const dy = e.pageY - this.prevY;
            this.prevX = e.pageX;
            this.prevY = e.pageY;

            const best = sensorLocations.map((location, index) => {
                return [(this.state.dragX - this.xoffset + 15 - location[0]) ** 2 + (this.state.dragY + 15 - location[1]) ** 2, index];
            }).filter(
                distance => distance[0] < 225
            ).sort(
                (a, b) => a[0] - b[0]
            );
            const near = this.state.near.map((_, i) => best.length > 0 && i === best[0][1])
            this.setState(state => ({
                dragX: state.dragX + dx,
                dragY: state.dragY + dy,
                near,
            }));
        }
    }

    handleMouseUp = (e) => {
        if (this.state.interactivity && this.state.dragging >= 0) {
            const sensors = this.state.sensors.map((v, i) => this.state.near[i] ? this.state.dragging : v);
            const near = this.state.near.map((_) => false);
            this.setState(state => ({
                dragging: -1,
                sensors,
                near,
            }), () => {

                this.props.socket.emit("sensorUpdate", { sensors: this.state.sensors, room: this.props.roomCode });
            });
        }
    }

    handleSensorClick = (e) => {
        if (!this.state.interactivity) {
            return;
        }
        const fpX = this.floorPlanRef.current.getBoundingClientRect().x;
        const fpY = this.floorPlanRef.current.getBoundingClientRect().y;
        const clickX = e.pageX;
        const clickY = e.pageY;
        const locX = clickX - fpX;
        const locY = clickY - fpY;

        const best = sensorLocations.map((location, index) => {
            return [(locX - this.xoffset + 15 - location[0]) ** 2 + (locY + 15 - location[1]) ** 2, index];
        }).filter(
            distance => distance[0] < 900
        ).sort(
            (a, b) => a[0] - b[0]
        );

        if (best.length > 0) {
            const dragging = this.state.holdingShift ? -1 : this.state.sensors[best[0][1]];
            const sensors = this.state.sensors.map((v, i) => (dragging !== -1 || this.state.holdingShift) && i === best[0][1] ? -1 : v);
            const near = this.state.near.map((v, i) => (dragging !== -1 || this.state.holdingShift) && i === best[0][1] ? true : v && this.state.holdingShift);

            this.prevX = e.nativeEvent.pageX;
            this.prevY = e.nativeEvent.pageY;
            this.setState(state => ({
                dragging,
                sensors,
                near,
                dragX: sensorLocations[best[0][1]][0] - 15 + this.xoffset,
                dragY: sensorLocations[best[0][1]][1] - 15,
            }), () => {

                this.props.socket.emit("sensorUpdate", { sensors: this.state.sensors, room: this.props.roomCode });
            });
        }

    }

    handleKeyDown = (e) => {
        if (e.key === "Shift") {
            this.setState({holdingShift: true});
        }
    }

    handleKeyUp = (e) => {
        if (e.key === "Shift") {
            this.setState({holdingShift: false});
        }
    }

    componentDidMount() {
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    componentWillUnmount() {
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);

    }

    render() {
        return (
            <div className="floor-planner" ref={this.floorPlanRef} onMouseDown={this.handleSensorClick}>
                <div className="controls">
                        <div className="sensor-source">
                            <div 
                                className="sensor-sample sample-motion"
                                onMouseDown={(e) => {
                                    if (!this.state.interactivity) {
                                        return;
                                    }
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
                            <div className="tool-tip">Motion Sensor</div>
                        </div>
                        <div className="sensor-source">
                            <div 
                                className="sensor-sample sample-laser"
                                onMouseDown={(e) => {
                                    if (!this.state.interactivity) {
                                        return;
                                    }
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
                            <div className="tool-tip">Laser Trip Wire</div>
                        </div>
                        <div className="sensor-source">
                            <div 
                                className="sensor-sample sample-camera"
                                onMouseDown={(e) => {
                                    if (!this.state.interactivity) {
                                        return;
                                    }
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
                            <div className="tool-tip">Camera</div>
                        </div>
                        <button className="export" onClick={(e) => {
                            e.target.disabled = true;
                            this.props.socket.emit("floor-plan", {
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
                            <img src="/desktop/send.svg" alt="Send icon"/>
                            <div className="tool-tip">Export to Chat</div>
                        </button>
                    </div>
                <div className="sensor-container">
                    <div className={`hiding-container ${this.state.red ? "red-alert" : ""}`}>
                        {this.state.part2 ? 
                            (!this.state.red ? <div className="alex-location" style={{
                                top: this.state.location.ycor * 60 + 20, 
                                left: this.state.location.xcor * 60 + 20, 
                            }} /> : null) :
                            <div className="entrance">&#8615;</div>
                        }
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