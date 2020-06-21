const express = require('express');
const path = require('path');

const SocketIO = require("socket.io");
const http = require("http");

const api = require("./api");
const handleIo = require("./socketHandler");

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Define API
app.use("/api", api);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.info("Listening on port", bind);
}

const port = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

const io = SocketIO(server);
handleIo(io);
