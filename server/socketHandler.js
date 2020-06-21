const { joinRoom, newTextMessage } = require("./utils");

function handleIo(io) {
    io.on("connection", socket => {
        console.log("connected", socket.id);
    
        socket.on("joinRoom", roomCode => {
            const room = joinRoom(socket, roomCode);
        });
    
        socket.on("newTextMessage", ({roomCode, content, sender}) => {
            const messages = newTextMessage(io, socket, roomCode, content, sender);
        });
    });
}

module.exports = handleIo;