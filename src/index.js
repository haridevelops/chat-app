const path = require('path');
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { generateMessage, generateLocationMessage } = require("./utils/messages");

const port = process.env.PORT || 3000;
const dirPath = path.join(__dirname, '../public');

app.use(express.static(dirPath));

let welcomeMsg = "Welcome!";

io.on("connection", (socket) => {
    console.log("new web socket connection");

    socket.emit('newUser', generateMessage('Welcome!'));
    socket.broadcast.emit('newUser', generateMessage('A new User has joined'));

    socket.on('sendMessage', (message, callback) => {
        let filter = new Filter();
        if (filter.isProfane(message)) return callback('Profanity is not allowed');
        io.emit('newUser', generateMessage(message));
        callback();
    })

    socket.on('sendLocation', (position, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();
    })

    socket.on('disconnect', () => {
        io.emit('newUser', generateMessage('A new User has left!'));
    })
})

server.listen(port, () => {
    console.log(`App started in ${port}`);
})