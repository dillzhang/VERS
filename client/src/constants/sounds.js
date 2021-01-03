const SOUNDS = {
  click: {
    // Path to the file
    source: "/sounds/click.mp3",
    // If true, sound will continue playing if played again while playing
    // If false, sound start playing from beginning if played again
    dnd: false,
    // Duration sound should be played for in milliseconds
    duration: -1,
    // If true, new sound will be created. sounds cannot be stopped
    createNew: true,
  },
  messageSent: {
    source: "/sounds/message-sent.mp3",
    dnd: false,
    duration: -1,
    createNew: true,
  },
  messageReceived: {
    source: "/sounds/message-received.mp3",
    dnd: false,
    duration: -1,
    createNew: true,
  },
  newApp: {
    source: new Audio("/sounds/new-app.mp3"),
    dnd: false,
    duration: -1,
  },
  warning: {
    source: new Audio("/sounds/warning.mp3"),
    dnd: false,
    duration: -1,
  },
  ambiance: {
    source: new Audio("/sounds/test.mp3"),
    dnd: true,
    duration: -1,
  },
};

const SOUND_DURATIONS = {};

Object.keys(SOUNDS).forEach((soundId) => {
  SOUND_DURATIONS[soundId] =
    SOUNDS[soundId].duration && SOUNDS[soundId].duration > -1
      ? SOUNDS[soundId].duration
      : SOUNDS[soundId].source.duration * 1000;
});

export { SOUNDS, SOUND_DURATIONS };
