import React, { Component } from 'react';

class Guest extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
  }s

  render() {
    return (
      <div className="App">
        <h1>Player</h1>
      </div>
    );
  }
}

export default Guest;