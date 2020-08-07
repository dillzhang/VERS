import React, { useState, useEffect, useRef } from 'react';


import './Elevator.css';

function Elevator(){

  const [text, setText] = useState("Ask the participants to select a floor to go to (options 1-5). Click the 'elevator' button to see what's on each floor.");
  const [isDisabled, setDisabled] = useState(false);
  const disRef = useRef(isDisabled);

  const load_floor = (floor) => {
    // console.log(floor)
    setTimeout(() => {
      console.log('abled')
      setDisabled(false); // count is 0 here
      switch(floor) {
        case '1':
          setText('floor 1 text');
          break;

        case '2':
          setText('floor 2 text');
          break;

        case '3':
          setText('floor 3 text');
          break;

        case '4':
          setText('floor 4 text');
          break;
        case '5':
          setText('floor 5 text');
          break;
      }
    }, 3000);
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
        <button className='button' onClick={() => load_floor('1')} disabled={isDisabled}>1</button>
        <button className='button' onClick={() => load_floor('2')} disabled={isDisabled}>2</button>
        <button className='button' onClick={() => load_floor('3')} disabled={isDisabled}>3</button>
        <button className='button' onClick={() => load_floor('4')} disabled={isDisabled}>4</button>
        <button className='button' onClick={() => load_floor('5')} disabled={isDisabled}>5</button>
      </grid>

      <grid item className="text">
        <p>{text}</p>
      </grid>

    </grid>

    </div>

  )
}

export default Elevator;