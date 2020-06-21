const rooms = {
    TEST: {
        state: 0,
        messages: [],
    },
}

const getRooms = () => {
    return Object.keys(rooms);
}

const randomString = () => {
    const availableChars = "ABCDEFGHJKLMNPRSTUVWYXZ";
    let output = "";
    while (output.length < 4) {
        output += availableChars.substr(Math.floor(availableChars.length * Math.random()), 1)
    } 
    return output;
}

const createNewRoom = () => {
    const id = randomString();
    rooms[id] = {
        state: 0,
        messages: [],
    };
    return id;
}

const newTextMessage = (io, socket, roomCode, content, sender) => {
    if (!rooms.hasOwnProperty(roomCode)) {
        // TODO: Error Handling
        return;
    }
    console.log(sender);
    rooms[roomCode].messages.push({
        type: "text",
        time: Date.now(),
        sender,
        content,
    });
    io.to(roomCode).emit("messageStatus", rooms[roomCode].messages);
}

const joinRoom = (socket, roomCode) => {
    if (rooms.hasOwnProperty(roomCode)) {
        socket.join(roomCode, () => {
            socket.emit("roomStatus", rooms[roomCode]);
            return socket.emit("messageStatus", rooms[roomCode].messages);
        });
    } else {
        socket.emit("error", "invalid room");
    }
}

module.exports = {
    createNewRoom,
    getRooms,
    joinRoom,
    newTextMessage,
    randomString,
}