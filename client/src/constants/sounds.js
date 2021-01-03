const SOUNDS = {
  click: {
    // Path to the file
    source: new Audio("/sounds/test.mp3"),
    // If true, sound will continue playing if played again while playing
    // If false, sound start playing from beginning if played again
    dnd: true,
    // Duration sound should be played for in milliseconds
    duration: -1,
    // If true, new sound will be created. sounds cannot be stopped
    createNew: true,
  },
  messageSent: {
    source: new Audio("/sounds/test.mp3"),
    dnd: false,
    duration: -1,
    createNew: true,
  },
  messageRecieved: {
    source: new Audio("/sounds/test.mp3"),
    dnd: false,
    duration: -1,
    createNew: true,
  },
  newApp: {
    source: new Audio("/sounds/test.mp3"),
    dnd: false,
    duration: -1,
  },
  warning: {
    source: new Audio("/sounds/test.mp3"),
    dnd: false,
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
