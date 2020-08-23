import React, { useState, useEffect, useRef } from 'react';


import './Elevator.css';

function Elevator(props){

  const [text, setText] = useState("Ask the participants to select a floor to go to (options 1-5). Click the 'elevator' button to see what's on each floor.");
  const [isDisabled, setDisabled] = useState(false);
  const disRef = useRef(isDisabled);

  const load_floor = (floor) => {
    // console.log(floor)
    setTimeout(() => {
      console.log('abled')
      setDisabled(false); // count is 0 here
      switch(floor) {
        case 'G':
          setText("Looks like this is where we came in from. Let's see if any of the other floors look suspicious");
          break;

        case 'S1':
          setText("Hmm, I can't see much but looks like a bunch of empty tables. Let's try an other floor.");
          break;

        case 'S2':
          setText("Looks empty, some of the walls are torn down but I don't see anything here. Let's try a different floor.");
          break;

        case 'S3':
          props.successCallback();
          break;

        case 'S4':
          setText("Nothing here but dust. Maybe there's something on another one of the floors.");
          break;

        default:
          setText("Something wrong has occurred");
          break;
      }
    }, 8000);
    console.log('disabled')
    setDisabled(true);
    setText('The elevator is going to floor ' + floor)
  }

  useEffect(() => {

  }, []);

  return(
    <div>
    <grid className="container">
      <grid item className="buttons">
        <button className='button' onClick={() => load_floor('G')} disabled={isDisabled}>G</button>
        <button className='button' onClick={() => load_floor('S1')} disabled={isDisabled}>S1</button>
        <button className='button' onClick={() => load_floor('S2')} disabled={isDisabled}>S2</button>
        <button className='button' onClick={() => load_floor('S3')} disabled={isDisabled}>S3</button>
        <button className='button' onClick={() => load_floor('S4')} disabled={isDisabled}>S4</button>
      </grid>

      <grid item className="text">
        <p>{text}</p>
      </grid>

    </grid>

    </div>

  )
}

export default Elevator;