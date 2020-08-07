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
        state: 0,
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
}

const getRooms = () => {
    return Object.keys(rooms).map(room => {
        return {
            roomCode: room,
            password: rooms[room].password,
        }
    });
}

const verifyRoom = (roomCode, password) => {
    return rooms.hasOwnProperty(roomCode) && rooms[roomCode].password == password;
}

const randomString = () => {
    const availableChars = "ABCDEFGHJKLMNPRSTUVWYXZ";
    let output = "";
    while (output.length < 6) {
        output += availableChars.substr(Math.floor(availableChars.length * Math.random()), 1)
    } 
    return output;
}

const createNewRoom = () => {
    const id = randomString();
    rooms[id] = {
        state: 0,
        password: "$ecretPassw0rd",

        messages: [],

        endTime: -1,
        timerId: -1,
    };
    return {roomCode: id, password: rooms[id].password};
}

const getMessages = (roomCode) => {
    if (rooms.hasOwnProperty(roomCode)) {
        return rooms[roomCode].messages;
    } else {
        return [];
    }
}

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
        color
    });
    io.to(roomCode).emit("messageStatus", rooms[roomCode].messages);

}

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
        color
    });
    io.to(roomCode).emit("messageStatus", rooms[roomCode].messages);
}

const joinRoom = (socket, roomCode) => {
    if (rooms.hasOwnProperty(roomCode)) {
        socket.join(roomCode, () => {
            socket.emit("joinRoomStatus", { state: rooms[roomCode].state });
            socket.emit("messageStatus", rooms[roomCode].messages);
        });
    } else {
        socket.emit("error", "invalid room");
    }
}

const startTimer = (roomCode, io) => {
    if (!rooms.hasOwnProperty(roomCode)) {
        return;
    }
    rooms[roomCode].endTime = Date.now() + 1000 * 60 * 60 - 1;
    updateTime(roomCode, io);

    setRoomState(roomCode, io, 10);
}

const setRoomState = (roomCode, io, state) => {
    console.log(roomCode);
    rooms[roomCode].state = state;
    io.to(roomCode).emit("roomStateUpdate", { state });
}

const updateTime = (roomCode, io) => {
    clearTimeout(rooms[roomCode].timerId);
    const remaining = rooms[roomCode].endTime - Date.now();
    const seconds = "00" + (Math.floor(remaining / 1000) % 60);
    const minutes = "00" + (Math.floor(remaining / (60 * 1000)) % 60);
    const timer =  `${minutes.slice(minutes.length - 2, minutes.length)}:${seconds.slice(seconds.length - 2, seconds.length)}`;
    io.to(roomCode).emit("timer-update", { time: timer });
    rooms[roomCode].timerId = setTimeout(() => {updateTime(roomCode, io);}, 557);
}

const correctSensors = [ 2, 0, 1, 0, 0, 0, 1, 0, 2, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2 ];
const checkSensors = (roomCode, io, sender, color, sensors) => {
    newFileMessage(io, null, roomCode, "floor_plan_4", sender, color);
    const sensorCount = [0 ,0 ,0];
    let empty = 0;
    if (correctSensors.map((value, index) => {
        if (sensors[index] > -1) {
            console.log(sensors[index])
            sensorCount[sensors[index]] += 1;
            console.log(sensorCount);
        } else {
            empty += 1;
        }
        return sensors[index] == value;
    }).every(a => a)) {
        setRoomState(roomCode, io, 40)
    } else {
        if (empty > 0) {
            io.to(roomCode).emit("floor-plan-wrong", {line: "You seem to be missing a few sensors."});
        } else if (sensorCount[2] > 4) {
            io.to(roomCode).emit("floor-plan-wrong", {line: "You seem to have too many laser trip wires."});
        } else if (sensorCount[1] > 4) {
            io.to(roomCode).emit("floor-plan-wrong", {line: "You seem to have too many motion sensors."});
        } else if (sensorCount[0] > 14) {
            io.to(roomCode).emit("floor-plan-wrong", {line: "You seem to have too many cameras."});
        } else {
            io.to(roomCode).emit("floor-plan-wrong", {line: "Your sensors don't match up with what I am see here."});
        }
    }
}

module.exports = {
    checkSensors,
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
}