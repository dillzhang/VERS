import React, { useState, useEffect, useRef } from "react";

import "./Elevator.css";

const ELEVATOR_DURATION = 10000;
const FLOORS = ["G", "S1", "S2", "S3", "S4"];

function Elevator(props) {
  const [text, setText] = useState("Waiting for floor selection...");
  const [floor, setFloor] = useState("G");
  const [isDisabled, setDisabled] = useState(false);

  const load_floor = (floor) => {
    setTimeout(() => {
      setDisabled(false); // count is 0 here
      setFloor(floor);
      switch (floor) {
        case "G":
          setText(
            "Looks like this is where we came in from. Let's checkout the other floors."
          );
          break;

        case "S1":
          setText("Empty tables. Some food left out. Smell of coffee.");
          break;

        case "S2":
          setText("Cardboard boxes. Very dusty.");
          break;

        case "S3":
          setText(
            "CORRECT! Hallway with a lot of security. Don't see any guards."
          );
          props.successCallback();
          break;

        case "S4":
          setText("Empty offices. Some working at their desk.");
          break;

        default:
          setText("Something wrong has occurred");
          break;
      }
    }, ELEVATOR_DURATION);
    setFloor("-");
    setDisabled(true);
    setText("The elevator is going to floor " + floor);
  };

  useEffect(() => {}, []);

  return (
    <div className="elevator">
      <p>Please select a floor:</p>
      <div item className="floor-selection">
        {FLOORS.map((f) => {
          return (
            <button
              key={`floor-${f}`}
              className={`${
                floor === f ? "selected" : isDisabled ? "disabled" : ""
              }`}
              onClick={() => load_floor(f)}
              disabled={isDisabled || floor === f}
            >
              {f}
            </button>
          );
        })}
      </div>
      <p>
        Status:
        <div className={`progress-bar ${isDisabled ? "active" : "inactive"}`}>
          <span className={`meter`} />
        </div>
      </p>
      <p className="status-output">{text}</p>
    </div>
  );
}

export default Elevator;
