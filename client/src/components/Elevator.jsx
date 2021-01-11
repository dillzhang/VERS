import React, { useState, useEffect } from "react";

import "./Elevator.css";

const ELEVATOR_DURATION = 12000;
const FLOORS = ["G", "S1", "S2", "S3", "S4"];

function Elevator(props) {
  const [text, setText] = useState("Waiting for floor selection...");
  const [floor, setFloor] = useState("G");
  const [isDisabled, setDisabled] = useState(false);
  const [elevatorSounds] = useState(["S2_elevator_1_floor_delta", "S2_elevator_2_floor_delta", "S2_elevator_3_floor_delta", "S2_elevator_4_floor_delta"]);
  const [floorList] = useState(["G", "S1", "S2", "S3", "S4"]);

  const load_floor = (floor) => {
    props.globalPlaySound("S2_elevator_1_floor_delta");
    setTimeout(() => {
      setDisabled(false); // count is 0 here
      setFloor(floor);
      switch (floor) {
        case "G":
          setText(
            "WRONG: Looks like this is where we came in from. Let's check out the other floors."
          );
          break;

        case "S1":
          setText("WRONG: Empty tables. Some food left out. Smell of coffee.");
          break;

        case "S2":
          setText("WRONG: Cardboard boxes. Very dusty.");
          break;

        case "S3":
          setText(
            "CORRECT: Hallways, doors, and security cameras. Don't see any guards."
          );
          props.successCallback();
          break;

        case "S4":
          setText("WRONG: Empty offices, desks... SOMEONE THERE!");
          break;

        default:
          setText("Something wrong has occurred");
          break;
      }
    }, ELEVATOR_DURATION);
    setFloor("-");
    setDisabled(true);
    setText(`Going to Floor ${floor}...`);
  };

  useEffect(() => {}, []);

  return (
    <div className="elevator">
      <p>Please select a floor:</p>
      <div className="floor-selection">
        {FLOORS.map((f) => {
          return (
            <button
              key={`floor-${f}`}
              className={`${
                floor === f ? "selected" : isDisabled ? "disabled" : ""
              }`}
              onClick={() => {
                load_floor(f);
              }}
              disabled={isDisabled || floor === f}
            >
              {f}
            </button>
          );
        })}
      </div>
      <div className="status-container">
        <p>Status:</p>
        <div className={`progress-bar ${isDisabled ? "active" : "inactive"}`}>
          <span className={`meter`} />
        </div>
      </div>
      <p className="status-output">{text}</p>
    </div>
  );
}

export default Elevator;
