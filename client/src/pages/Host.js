import React, { Component } from 'react';

class Host extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
  }

  render() {
    return (
      <div className="App">
        <h1>Actor</h1>
      </div>
    );
  }
}

export default Host;