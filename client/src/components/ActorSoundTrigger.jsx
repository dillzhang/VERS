import React, { Component } from "react";

import { SOUNDS } from "../constants/sounds";

import "./ActorSoundTrigger.css";

class ActorSoundTrigger extends Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
    this.timeout = -1;

    this.stopSound = (callback = () => {}) => {
      clearTimeout(this.timeout);
      this.setState({ active: false }, callback);
    };

    this.startSound = () => {
      this.setState({ active: true });

      //   Stop the Sound
      this.timeout = setTimeout(() => {
        this.setState({ active: false });
      }, this.duration);
    };

    this.handlePlaySound = ({ soundId }) => {
      if (soundId === this.props.soundId) {
        if (this.state.active && !SOUNDS[this.props.soundId].dnd) {
          this.stopSound(() => {
            setTimeout(this.startSound, 110);
          });
        } else {
          this.startSound();
        }
      }
    };

    this.handleStopSound = ({ soundId }) => {
      if (soundId === this.props.soundId) {
        this.stopSound();
      }
    };

    this.handleDurationChange = () => {
      this.duration =
        SOUNDS[this.props.soundId].duration &&
        SOUNDS[this.props.soundId].duration > -1
          ? SOUNDS[this.props.soundId].duration
          : SOUNDS[this.props.soundId].source.duration * 1000;
      this.style = {
        "--trigger-animation-duration": `${this.duration / 1000}s`,
      };
    };
  }

  componentDidMount() {
    this.props.socket.on("playSound", this.handlePlaySound);
    this.props.socket.on("stopSound", this.handleStopSound);

    SOUNDS[this.props.soundId].source.addEventListener(
      "durationchange",
      this.handleDurationChange
    );
  }

  componentWillUnmount() {
    this.props.socket.off("playSound", this.handlePlaySound);
    this.props.socket.off("stopSound", this.handleStopSound);

    SOUNDS[this.props.soundId].source.removeEventListener(
      "durationchange",
      this.handleDurationChange
    );
  }

  render() {
    return (
      <div className="actor-sound-trigger">
        <div
          className={`progress-bar progress-bar-${
            this.state.active ? "active" : "inactive"
          }`}
          style={this.style}
        />
        <button
          className="actor-trigger-button"
          onClick={() => {
            this.props.playSound(this.props.soundId);
          }}
        >
          Play{" "}
          {this.props.soundName ? this.props.soundName : this.props.soundId}
        </button>
        {this.props.stoppable && this.state.active && (
          <button
            className="actor-stop-button warning"
            onClick={() => {
              this.props.stopSound(this.props.soundId);
            }}
          >
            ✖
          </button>
        )}
      </div>
    );
  }
}

export default ActorSoundTrigger;
