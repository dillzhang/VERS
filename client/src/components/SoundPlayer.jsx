import React, { useState, useRef, useEffect, useImperativeHandle } from "react";

import "./SoundPlayer.css";

import { SOUNDS } from "../constants/sounds";

const SoundPlayer = React.forwardRef((props, ref) => {
  const [isMuted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);

  const currentlyPlaying = useRef(new Set());

  const playSound = (soundId) => {
    console.log("Play Sound:", soundId);
    if (SOUNDS[soundId].createNew) {
      const source = new Audio(SOUNDS[soundId].source);
      source.volume = volume / 100;
      source.muted = isMuted;
      source.play();
      return;
    }

    if (SOUNDS[soundId].dnd && currentlyPlaying.current.has(soundId)) {
      return;
    }

    SOUNDS[soundId].source.pause();
    SOUNDS[soundId].source.currentTime = 0;
    SOUNDS[soundId].source.play();

    currentlyPlaying.current.add(soundId);
    setTimeout(
      () => {
        stopSound(soundId);
      },
      SOUNDS[soundId].duration && SOUNDS[soundId].duration > -1
        ? SOUNDS[soundId].duration
        : SOUNDS[soundId].source.duration * 1000
    );
  };

  const stopSound = (soundId) => {
    SOUNDS[soundId].source.pause();
    SOUNDS[soundId].source.currentTime = 0;
    currentlyPlaying.current.delete(soundId);
  };

  useImperativeHandle(ref, () => ({
    playSound,
    stopSound,
  }));

  useEffect(() => {
    Object.keys(SOUNDS)
      .filter((audio) => !SOUNDS[audio].createNew)
      .forEach((audio) => {
        SOUNDS[audio].source.volume = volume / 100;
      });
    props.socket.on("playSound", ({ soundId }) => {
      playSound(soundId);
    });

    props.socket.on("stopSound", ({ soundId }) => {
      stopSound(soundId);
    });
  }, []);

  return (
    <div className={`sound-player`}>
      <div
        className={`sound-icon ${
          isMuted ? "icon-muted" : volume <= 0 ? "icon-empty" : "icon-full"
        }`}
      />
      <div className={"hover-items"}>
        <div className="sound-slider">
          <div className="input-holder">
            <input
              className={`input-range ${isMuted ? "muted" : ""}`}
              type="range"
              step="2"
              value={volume}
              min="0"
              max="100"
              onChange={(e) => {
                Object.keys(SOUNDS)
                  .filter((audio) => !SOUNDS[audio].createNew)
                  .forEach((audio) => {
                    SOUNDS[audio].source.volume = e.target.value / 100;
                  });
                setVolume(e.target.value);
              }}
            />
          </div>
        </div>
        <label className="sound-mute">
          <input
            type="checkbox"
            checked={isMuted}
            onChange={(e) => {
              Object.keys(SOUNDS)
                .filter((audio) => !SOUNDS[audio].createNew)
                .forEach((audio) => {
                  SOUNDS[audio].source.muted = e.target.checked;
                });
              setMuted(e.target.checked);
            }}
          />
          <div className={`muted-display`} />
        </label>
      </div>
      this
    </div>
  );
});

export default SoundPlayer;
