const { adjectives, animals } = require("./constants/constants");
const {
  correctSensors,
  correctTranslationKey,
} = require("./constants/answers");
const { STATE_SOUNDS, TIME_SOUNDS } = require("./constants/soundForState");

const rooms = {
  PRESHOW: {
    failed: false,
    state: 0,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  P1A: {
    failed: false,
    state: 10,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  P1B: {
    failed: false,
    state: 20,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  P2A: {
    failed: false,
    state: 30,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  P2B: {
    failed: false,
    state: 40,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  P3A: {
    failed: false,
    state: 50,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  P3B: {
    failed: false,
    state: 60,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  P3B9: {
    failed: false,
    state: 69,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  SUCCESS: {
    failed: false,
    state: 70,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },

  FAILURE: {
    failed: true,
    state: 80,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
    secondsRemaining: 3599,

    sounds: new Set(),
  },
};

const getRooms = () => {
  return Object.keys(rooms).map((room) => {
    return {
      roomCode: room,
      password: rooms[room].password,
    };
  });
};

const verifyRoom = (roomCode, password) => {
  return (
    rooms.hasOwnProperty(roomCode) &&
    (rooms[roomCode].password == password || password == "HOST")
  );
};

const randomString = () => {
  const availableChars = "ABCDEFGHJKLMNPRSTUVWYXZ";
  let output = "";
  while (output.length < 6) {
    output += availableChars.substr(
      Math.floor(availableChars.length * Math.random()),
      1
    );
  }
  return output;
};

const generatePassword = () => {
  const randomInt = Math.floor(99 * Math.random()) + 1;
  const randomAdj = adjectives[Math.floor(adjectives.length * Math.random())];
  const randomAnimal = animals[Math.floor(animals.length * Math.random())];

  return `${randomInt} ${randomAdj} ${randomAnimal}`.toLowerCase();
};

const createNewRoom = () => {
  const id = randomString();
  rooms[id] = {
    failed: false,
    state: 0,
    password: generatePassword(),

    messages: [],

    endTime: -1,
    timerId: -1,

    sounds: new Set(),
  };
  return { roomCode: id, password: rooms[id].password };
};

const addFiveMinutes = (roomCode) => {
  if (!rooms.hasOwnProperty(roomCode)) {
    // TODO: Error Handling
    return;
  }
  if (rooms[roomCode].endTime > -1) {
    rooms[roomCode].endTime += 5 * 60 * 1000;
  }
};

const getMessages = (roomCode) => {
  if (rooms.hasOwnProperty(roomCode)) {
    return rooms[roomCode].messages;
  } else {
    return [];
  }
};

const newFileMessage = (io, socket, roomCode, content, sender, color) => {
  if (!rooms.hasOwnProperty(roomCode)) {
    // TODO: Error Handling
    return;
  }
  rooms[roomCode].messages.push({
    type: "file",
    time: Date.now(),
    sender,
    content,
    color,
  });
  io.to(roomCode).emit("messageStatus", rooms[roomCode].messages);
};

const newTextMessage = (io, socket, roomCode, content, sender, color) => {
  if (!rooms.hasOwnProperty(roomCode)) {
    // TODO: Error Handling
    return;
  }
  rooms[roomCode].messages.push({
    type: "text",
    time: Date.now(),
    sender,
    content,
    color,
  });
  io.to(roomCode).emit("messageStatus", rooms[roomCode].messages);
};

const joinRoom = (socket, roomCode) => {
  if (rooms.hasOwnProperty(roomCode)) {
    socket.join(roomCode, () => {
      socket.emit("joinRoomStatus", {
        failed: rooms[roomCode].failed,
        state: rooms[roomCode].state,
        password: rooms[roomCode].password,
      });
      socket.emit("messageStatus", rooms[roomCode].messages);
      rooms[roomCode].sounds.forEach((soundId) => {
        socket.emit("playSound", { soundId });
      });
      setTimeout(() => {
        socket.emit("roomStateUpdate", {
          failed: rooms[roomCode].failed,
          state: rooms[roomCode].state,
        });
      }, 500);
    });
  } else {
    socket.emit("error", "invalid room");
  }
};

const startTimer = (roomCode, io) => {
  if (!rooms.hasOwnProperty(roomCode)) {
    return;
  }
  rooms[roomCode].startTime = Date.now();
  rooms[roomCode].endTime = Date.now() + 1000 * 50 * 60 - 1;
  rooms[roomCode].secondsRemaining = 2 * 60 * 60 - 1;
  updateTime(roomCode, io);

  setRoomState(roomCode, io, 10);
};

const setRoomState = (roomCode, io, state) => {
  // Stop any saved sound associated with the new state
  rooms[roomCode].sounds.forEach((soundId) => {
    if (!STATE_SOUNDS[state].has(soundId)) {
      globalStopSound(roomCode, io, soundId, true);
    }
  });

  // Start any sound associated with the new state if it is not playing
  STATE_SOUNDS[state].forEach((soundId) => {
    if (!rooms[roomCode].sounds.has(soundId)) {
      globalPlaySound(roomCode, io, soundId, true);
    }
  });

  rooms[roomCode].state = state;

  if (state === 80) {
    rooms[roomCode].failed = true;
  }

  io.to(roomCode).emit("roomStateUpdate", {
    state,
    failed: rooms[roomCode].failed,
  });
};

const updateSuccess = (roomCode, io) => {
  clearTimeout(rooms[roomCode].timerId);
  if (69 <= rooms[roomCode].state && rooms[roomCode].state < 75) {
    rooms[roomCode].state += 1;
    io.to(roomCode).emit("roomStateUpdate", {
      state: rooms[roomCode].state,
      failed: rooms[roomCode].failed,
    });
    rooms[roomCode].timerId = setTimeout(() => {
      updateSuccess(roomCode, io);
    }, 2000 + Math.random() * 2000);
  }
  return;
};

const startRoomSuccess = (roomCode, io) => {
  updateSuccess(roomCode, io);
};

const updateTime = (roomCode, io) => {
  clearTimeout(rooms[roomCode].timerId);
  rooms[roomCode].secondsRemaining = Math.max(
    ...[rooms[roomCode].secondsRemaining - 1, 1]
  );

  if (TIME_SOUNDS.hasOwnProperty(rooms[roomCode].secondsRemaining)) {
    const sounds = TIME_SOUNDS[rooms[roomCode].secondsRemaining];
    sounds.forEach((sound) => {
      globalPlaySound(roomCode, io, sound, false);
    });
  }

  if (rooms[roomCode].secondsRemaining <= 0) {
    setRoomState(roomCode, io, 80);
    return;
  }

  const remaining = rooms[roomCode].endTime - Date.now();
  if (rooms[roomCode].state >= 69) {
    return;
  }
  const seconds = "00" + (Math.floor(remaining / 1000) % 60);
  const minutes = "00" + Math.floor(remaining / (60 * 1000));
  const timer = `${minutes.slice(
    minutes.length - 2,
    minutes.length
  )}:${seconds.slice(seconds.length - 2, seconds.length)}`;

  const playerSeconds =
    "00" + Math.floor((rooms[roomCode].secondsRemaining / 2) % 60);
  const playerMinutes =
    "00" + Math.floor(rooms[roomCode].secondsRemaining / 2 / 60);
  const playerTimer = `${playerMinutes.slice(
    playerMinutes.length - 2,
    playerMinutes.length
  )}:${playerSeconds.slice(playerSeconds.length - 2, playerSeconds.length)}`;

  const delay = remaining / rooms[roomCode].secondsRemaining;

  io.to(roomCode).emit("timer-update", {
    time: playerTimer,
    actualTime: timer,
  });

  rooms[roomCode].timerId = setTimeout(() => {
    updateTime(roomCode, io);
  }, delay);
};

const checkSensors = (roomCode, io, sender, color, sensors) => {
  newFileMessage(io, null, roomCode, "floor_plan_4", sender, color);
  const sensorCount = [0, 0, 0];
  let empty = 0;
  if (
    correctSensors
      .map((value, index) => {
        if (sensors[index] > -1) {
          sensorCount[sensors[index]] += 1;
        } else {
          empty += 1;
        }
        return sensors[index] == value;
      })
      .every((a) => a) &&
    rooms[roomCode].state < 39
  ) {
    setRoomState(roomCode, io, 39);
    io.to(roomCode).emit("update-line-from-submission", {
      line:
        "This looks right to me. Great job. I’m sharing my location with you.",
    });
  } else {
    if (empty > 0) {
      io.to(roomCode).emit("update-line-from-submission", {
        line: "You seem to be missing a few sensors.",
      });
    } else if (sensorCount[2] > 4) {
      io.to(roomCode).emit("update-line-from-submission", {
        line: "You seem to have too many laser trip wires.",
      });
    } else if (sensorCount[1] > 4) {
      io.to(roomCode).emit("update-line-from-submission", {
        line: "You seem to have too many motion sensors.",
      });
    } else if (sensorCount[0] > 14) {
      io.to(roomCode).emit("update-line-from-submission", {
        line: "You seem to have too many cameras.",
      });
    } else {
      io.to(roomCode).emit("update-line-from-submission", {
        line: "Your sensors don't match up with what I am see here.",
      });
    }
  }
};

const checkTranslator = (roomCode, io, sender, color, translationKey) => {

  try {
    newFileMessage(io, null, roomCode, "translationKey", sender, color);
    let correct = Object.keys(translationKey).filter((value) => {
      return (
        correctTranslationKey[value].english === "" ||
        translationKey[value].english === correctTranslationKey[value].english
      );
    });
    if (correct.length >= 23 && rooms[roomCode].state < 69) {
      setRoomState(roomCode, io, 69);
      io.to(roomCode).emit("update-line-from-submission", {
        line: `[${correct.length} / 26] *Translation complete. Continue scene below.*`,
      });
    } else {
      if (correct.length >= 20) {
        io.to(roomCode).emit("update-line-from-submission", {
          line: `[${correct.length} / 26] I can kinda read this, but it needs to be clearer before we can share it.`,
        });
      } else if (correct.length >= 13) {
        io.to(roomCode).emit("update-line-from-submission", {
          line: `[${correct.length} / 26] This is starting to look like English. Keep going.`,
        });
      } else {
        io.to(roomCode).emit("update-line-from-submission", {
          line: `[${correct.length} / 26] This is just gibberish. What does it say?`,
        });
      }
    }
  }
  catch(err) {
    console.log("ERROR in checkTranslator:", err);
  }
  
};

const globalPlaySound = (roomCode, io, soundId, save) => {
  if (!rooms.hasOwnProperty(roomCode)) {
    // TODO: Error Handling
    return;
  }
  if (save) {
    rooms[roomCode].sounds.add(soundId);
  }
  io.in(roomCode).emit("playSound", { soundId });
};

const globalStopSound = (roomCode, io, soundId, save) => {
  if (!rooms.hasOwnProperty(roomCode)) {
    // TODO: Error Handling
    return;
  }
  if (save) {
    rooms[roomCode].sounds.delete(soundId);
  }
  io.in(roomCode).emit("stopSound", { soundId });
};

module.exports = {
  addFiveMinutes,
  checkSensors,
  checkTranslator,
  createNewRoom,
  getRooms,
  getMessages,
  globalPlaySound,
  globalStopSound,
  joinRoom,
  newFileMessage,
  newTextMessage,
  randomString,
  setRoomState,
  startTimer,
  startRoomSuccess,
  verifyRoom,
};
