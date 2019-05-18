const path = require('path');
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { generateMessage, generateLocationMessage } = require("./utils/messages");
const { addUser, getUser, getUsersInRoom, removeUser } = require("./utils/users");

const port = process.env.PORT || 3000;
const dirPath = path.join(__dirname, '../public');

app.use(express.static(dirPath));

io.on("connection", (socket) => {
    console.log("new web socket connection");

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) return callback(error)

        socket.join(user.room);

        socket.emit('newUser', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('newUser', generateMessage('Admin', `${user.username} has joined!`));

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        let filter = new Filter();
        if (filter.isProfane(message)) return callback('Profanity is not allowed');

        const user = getUser(socket.id);

        if (!user) return callback('Error message')

        io.to(user.room).emit('newUser', generateMessage(user.username, message));
        callback();
    })

    socket.on('sendLocation', (position, callback) => {
        const user = getUser(socket.id);

        if (!user) return callback('Error message')

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();Admin
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) io.to(user.room).emit('newUser', generateMessage('Admin', `${user.username} has left!`));
    })
})

server.listen(port, () => {
    console.log(`App started in ${port}`);
})