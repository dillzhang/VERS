import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    axios.get(`/api/room`).then((res) => {
      this.setState({ rooms: res.data });
    });
  }

  newRoom = () => {
    axios.post(`/api/room`).then((res) => {
      console.log(res);
      this.setState({ rooms: [...this.state.rooms, res.data] });
    });
  };

  render() {
    console.log(this.props.match.params);
    if (
      !this.props.match.params ||
      this.props.match.params.password !== "password123"
    ) {
      return <div className="Admin">You do not have access to this page!</div>;
    }
    return (
      <div className="Admin">
        <div className="header">
          <h1>VERS HOME</h1>
          <button onClick={this.newRoom}>New Room</button>
        </div>
        <div className="content">
          <div className="content-row">
            <div>Room Code</div>
            <div>Password</div>
            <div>Actor</div>
            <div>Player</div>
          </div>
          {this.state.rooms.map((room) => {
            console.log(room);
            const r = room.roomCode;
            return (
              <div key={r} className="content-row">
                <div>{r}</div>
                <div>{room.password}</div>
                <div>
                  <Link to={`/actor/${r}`}>
                    <button variant="raised">Actor</button>
                  </Link>
                </div>
                <div>
                  <Link to={`/player/${r}/$ecretPassw0rd`}>
                    <button variant="raised">Player</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default Admin;
