const { getMessages, joinRoom, newTextMessage, startTimer, verifyRoom } = require("./utils");
const e = require("express");

function handleIo(io) {
    io.on("connection", socket => {
        console.log("connected", socket.id);

        socket.on("disconnect", ()  => {
            console.log("disconnected", socket.id);
        });
    
        socket.on("joinRoom", ({ room, password }) => {
            const roomCode = room;
            if (password == "HOST" || verifyRoom(room, password)) {
                joinRoom(socket, roomCode);
            } else {
                socket.emit("errorMessage", { message: "Incorrect Password"});
            }
        });

        socket.on("getTextMessage", ({roomCode}) => {
            socket.emit("messageStatus", getMessages(roomCode));
        });
    
        socket.on("newTextMessage", ({roomCode, content, sender}) => {
            const messages = newTextMessage(io, socket, roomCode, content, sender);
        });

        socket.on("start-time", ({ room }) => {
            startTimer(room, io);
        });
    });
}

module.exports = handleIo;