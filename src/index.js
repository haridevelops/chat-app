const path = require('path');
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const dirPath = path.join(__dirname, '../public');

app.use(express.static(dirPath));

let welcomeMsg = "Welcome!";

io.on("connection", (socket) => {
    console.log("new web socket connection");

    socket.emit('newUser', welcomeMsg);

    socket.on('sendMessage', (message) => {
        io.emit('newUser',message);
    })
})

server.listen(port, () => {
    console.log(`App started in ${port}`);
})