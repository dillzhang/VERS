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

        this.state = {
            sensors: [...Array(22)].map(_ => -1),
            near: [...Array(22)].map(_ => false),
        }
    }

    render() {
        return (
            <div className="floor-planner">
                <div className="sensor-container">
                    <div className="hiding-container">
                        {laserPairs.map((pair, index) => {
                            console.log(index, sensorLocations[pair[0]], sensorLocations[pair[1]])
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
                                    className={`sensor sensor-direction-${location[2]} sensor-type-${sensors[this.state.sensors[index]].class} ${this.state.near[index] ? "near" : ""}`} 
                                />
                            );
                        })}
                        {sensorLocations.map((location, index) => {
                            const style = { left: location[0], top: location[1] };
                            return (
                                <div 
                                    key={`sensor-${index}`} 
                                    style={style}
                                    className={`sensor sensor-direction-${location[2]} sensor-type-${sensors[this.state.sensors[index]].class} ${this.state.near[index] ? "near" : ""}`} 
                                />
                            );
                        })}
                    </div>
                </div>
                <div className="floor-plan" />
                <div className="controls">
                    <div className="sensor-source">
                        <div className="sensor-sample sample-camera"/>
                        Camera
                    </div>
                    <div className="sensor-source">
                        <div className="sensor-sample sample-motion"/>
                        Motion Sensor
                    </div>
                    <div className="sensor-source">
                        <div className="sensor-sample sample-laser"/>
                        Laser Trip Wire
                    </div>
                    <button className="export">
                        Export to Chat
                    </button>
                </div>
            </div>
        )
    }
}

export default FloorPlan