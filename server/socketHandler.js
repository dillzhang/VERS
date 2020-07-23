const { joinRoom, newTextMessage, startTimer } = require("./utils");

function handleIo(io) {
    io.on("connection", socket => {
        console.log("connected", socket.id);

        socket.on("disconnect", ()  => {
            console.log("disconnected", socket.id);
        });
    
        socket.on("joinRoom", roomCode => {
            console.log("joinRoom");
            const room = joinRoom(socket, roomCode);
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