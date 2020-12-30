const { adjectives, animals } = require("./constants");
const { correctSensors, correctTranslationKey } = require("./answers");

const rooms = {
  PRESHOW: {
    state: 0,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
  },

  P1A: {
    state: 10,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
  },

  P1B: {
    state: 20,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
  },

  P2A: {
    state: 30,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
  },

  P2B: {
    state: 40,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
  },

  P3A: {
    state: 50,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
  },

  P3B: {
    state: 60,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
  },

  SUCCESS: {
    state: 70,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
  },

  FAILURE: {
    state: 80,
    password: "$ecretPassw0rd",

    messages: [],

    endTime: -1,
    timerId: -1,
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
    state: 0,
    password: generatePassword(),

    messages: [],

    endTime: -1,
    timerId: -1,
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
        state: rooms[roomCode].state,
        password: rooms[roomCode].password,
      });
      socket.emit("messageStatus", rooms[roomCode].messages);
      setTimeout(() => {
        socket.emit("roomStateUpdate", { state: rooms[roomCode].state });
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
  rooms[roomCode].endTime = Date.now() + 1000 * 60 * 60 - 1;
  updateTime(roomCode, io);

  setRoomState(roomCode, io, 10);
};

const setRoomState = (roomCode, io, state) => {
  rooms[roomCode].state = state;
  io.to(roomCode).emit("roomStateUpdate", { state });
};

const updateTime = (roomCode, io) => {
  clearTimeout(rooms[roomCode].timerId);
  const remaining = rooms[roomCode].endTime - Date.now();
  if (remaining < 0) {
    setRoomState(roomCode, io, 80);
    return;
  }
  if (rooms[roomCode].state >= 70) {
    return;
  }
  const seconds = "00" + (Math.floor(remaining / 1000) % 60);
  const minutes = "00" + Math.floor(remaining / (60 * 1000));
  const timer = `${minutes.slice(
    minutes.length - 2,
    minutes.length
  )}:${seconds.slice(seconds.length - 2, seconds.length)}`;
  io.to(roomCode).emit("timer-update", { time: timer });
  rooms[roomCode].timerId = setTimeout(() => {
    updateTime(roomCode, io);
  }, 557);
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
      .every((a) => a)
  ) {
    setRoomState(roomCode, io, 40);
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
  newFileMessage(io, null, roomCode, "translationKey", sender, color);
  let correct = Object.keys(translationKey).filter((value) => {
    return (
      correctTranslationKey[value].english === "" ||
      translationKey[value].english === correctTranslationKey[value].english
    );
  });
  if (correct.length >= 23) {
    setRoomState(roomCode, io, 69);
    io.to(roomCode).emit("update-line-from-submission", {
      line: `This is break major news! I'll email the networks right away! (${correct.length} / 26 correct)`,
    });
  } else {
    if (correct.length >= 20) {
      io.to(roomCode).emit("update-line-from-submission", {
        line: `I can kinda read this, but its needs to be clearer before we spread the word. (${correct.length} / 26 correct)`,
      });
    } else if (correct.length >= 13) {
      io.to(roomCode).emit("update-line-from-submission", {
        line: `This is starting to look like english. Keep going. (${correct.length} / 26 correct)`,
      });
    } else {
      io.to(roomCode).emit("update-line-from-submission", {
        line: `This is just gibberish. What does it say? (${correct.length} / 26 correct)`,
      });
    }
  }
};

module.exports = {
  addFiveMinutes,
  checkSensors,
  checkTranslator,
  createNewRoom,
  getRooms,
  getMessages,
  joinRoom,
  newFileMessage,
  newTextMessage,
  randomString,
  setRoomState,
  startTimer,
  verifyRoom,
};
