import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    axios.get(`api/room`)
    .then(res => {
      this.setState({rooms: res.data});
    })
  }

  newRoom = () => {
    axios.post(`api/room`)
    .then(res => {
      console.log(res);
      this.setState({rooms: [...this.state.rooms, res.data]});
    });
  }

  render() {
    return (
    <div className="App">
      <h1>VERS HOME</h1>
      <button onClick={this.newRoom}>
        New Room
      </button>
      {this.state.rooms.map(r => {
        console.log(r);
        return <div key={r}>
          {r}
          <Link to={`./actor/${r}`}>
            <button variant="raised">
                Actor
            </button>
          </Link>
          <Link to={`./player/${r}`}>
            <button variant="raised">
                Player
            </button>
          </Link>
        </div>
      })}
    </div>
    );
  }
}
export default Home;