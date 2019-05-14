const socket = io();
const form = document.querySelector('form')

socket.on('newUser', (message) => {
    console.log(message);
})

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let message = event.target.elements.message;
    socket.emit('sendMessage', message);
})