import React, { Component } from 'react';
import { useHistory } from "react-router-dom";

import './Elevator.css';

function Elevator(){
  const history = useHistory();

  const load_floor = (floor) => {
    console.log(floor)
    let path = floor;
    history.push(path);
  }

  return(
    <div>
      <button className='button' onClick={() => load_floor('floor-1')} >1</button>
      <button className='button' onClick={() => load_floor('floor-2')}>2</button>
      <button className='button' onClick={() => load_floor('floor-3')}>3</button>
      <button className='button' onClick={() => load_floor('floor-4')}>4</button>
      <button className='button' onClick={() => load_floor('floor-5')}>5</button>

    </div>

  )
}

export default Elevator;