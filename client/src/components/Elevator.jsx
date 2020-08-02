import React, { useState, useEffect } from 'react';


import './Elevator.css';

function Elevator(){

  const [text, setText] = useState("Ask the participants to select a floor to go to (options 1-5). Click the 'elevator' button to see what's on each floor.");

  const load_floor = (floor) => {
    // console.log(floor)
    switch(floor) {
      case 'floor-1':
        setText('floor 1 text');
        break;

      case 'floor-2':
        setText('floor 2 text');
        break;

      case 'floor-3':
        setText('floor 3 text');
        break;

      case 'floor-4':
        setText('floor 4 text');
        break;
      case 'floor-5':
        setText('floor 5 text');
        break;

    }
  }

  useEffect(() => {

  });

  return(
    <div>
    <grid className="container">
      <grid item className="buttons">
        <button className='button' onClick={() => load_floor('floor-1')} >1</button>
        <button className='button' onClick={() => load_floor('floor-2')}>2</button>
        <button className='button' onClick={() => load_floor('floor-3')}>3</button>
        <button className='button' onClick={() => load_floor('floor-4')}>4</button>
        <button className='button' onClick={() => load_floor('floor-5')}>5</button>
      </grid>

      <grid item className="text">
        <p>{text}</p>
      </grid>

    </grid>

    </div>

  )
}

export default Elevator;