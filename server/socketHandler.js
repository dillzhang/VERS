const { getMessages, joinRoom, newFileMessage, newTextMessage, startTimer, verifyRoom } = require("./utils");
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

        socket.on("newFileMessage", ({roomCode, content, sender, color}) => {
            const messages = newFileMessage(io, socket, roomCode, content, sender, color);
        });
    
        socket.on("newTextMessage", ({roomCode, content, sender, color}) => {
            const messages = newTextMessage(io, socket, roomCode, content, sender, color);
        });

        socket.on("start-time", ({ room }) => {
            startTimer(room, io);
        });
    });
}

module.exports = handleIo;