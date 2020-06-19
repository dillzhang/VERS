import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
    <div className="App">
      <h1>VERS HOME</h1>
      <Link to={'./actor'}>
        <button variant="raised">
            Actor
        </button>
      </Link>
      <Link to={'./player'}>
        <button variant="raised">
            Player
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;