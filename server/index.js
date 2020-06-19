const express = require('express');
const path = require('path');
const api = require("./api");

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Define API
app.use("/api", api);

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
