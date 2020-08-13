import React, { Component } from 'react';

import './VideoStream.css';

class VideoStream extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      sensors: {
        A1: true,
        A3: true, // Always
        A4: true, // Always
        A10: true,
        B1: true,
        B3: true,
        B9: true,
        B12: true,
        C4: true,
        C5: false, // Always
        C9: false, // Always
        D1: true,
        D6: true,
        D12: true,
        E8: true,
        E9: true,
        E11: false, // Always
        E12: true,
        F6: true,
        G1: true,
        G4: true,
        G7: true,
        L1: true,
        L5: true,
        L9: true,
        L10: true,
        L12: true,
      },
      current: 0,
    }

    this.props.socket.on("electricalUpdate", ({state}) => {
      this.setState({sensors: state, current: 0}, () => {
        clearTimeout(this.timeoutId);
        this.addCurrent();
      });
    });
  }

  addCurrent = () => {
    clearTimeout(this.timeoutId);
    if (this.state.current < 10) {
      this.setState(state => ({
        current: state.current + 1,
      }));
      this.timeoutId = setTimeout(this.addCurrent, 995);
    }
  }

  componentDidMount() {
    this.addCurrent();
  }

  render() {
      return (
        <div className="video-streamer">
          <div className="electrical-panel">Electrical Panel</div>
          {Object.keys(this.state.sensors).map(sensor => {
            return <div key={`sensor-${sensor}`}>
              <div key={`${sensor}-status`} className={`status status-${this.state.sensors[sensor]}`}/>
              <div key={sensor} className="sensor">{sensor}</div>
            </div>
          })}
          <div className="current-info">
            <div>
              Current:
            </div>
            <div className="current-holder">
              {[...Array(this.state.current)].map((_, index) => {
                return <div key={index} className="current" />;
              })}
            </div>
            <div>
              OVERLOAD!
            </div>
          </div>
        </div>
      )
  }
}

export default VideoStream;