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
        C13: true, // Always
        D1: true,
        D6: true,
        D12: true,
        D14: true, // Always
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
        M2: true, // Always
        M6: true, // Always
        M11: true, // Always
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
          <div className="noise-wrapper">
            <div className="noise"></div>
          </div>
          <div className="electrical-panel">
            <div className="cluster">
              {Object.keys(this.state.sensors).slice(0, 8).map(sensor => {
                return <div key={`0-${sensor}-status`} className={`status status-${this.state.sensors[sensor]}`}/>
              })}
            </div>
            <div className="cluster">
              {Object.keys(this.state.sensors).slice(8, 16).map(sensor => {
                return <div key={`1-${sensor}-status`} className={`status status-${this.state.sensors[sensor]}`}/>
              })}
            </div>
            <div className="cluster">
              {Object.keys(this.state.sensors).slice(16, 24).map(sensor => {
                return <div key={`2-${sensor}-status`} className={`status status-${this.state.sensors[sensor]}`}/>
              })}
            </div>
            <div className="cluster">
              {Object.keys(this.state.sensors).slice(24, 32).map(sensor => {
                return <div key={`3-${sensor}-status`} className={`status status-${this.state.sensors[sensor]}`}/>
              })}
            </div>
            <div className="current-info">
              <div className="current-holder">
                {[...Array(this.state.current)].map((_, index) => {
                  return <div key={`timer-${index}`} className={`current ${index >= 6 && this.state.current >= 6 ? 'caution' : ''} ${((index >= 8 && this.state.current >= 8) || this.state.current >= 10) ? 'overload' : ''}`} />;
                })}
              </div>
            </div>
          </div>
        </div>
      )
  }
}

export default VideoStream;