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

document.getElementById("send-location")
        .addEventListener('click', (event) => {
            if (!navigator.geolocation) {
                alert('Feature not supported in this browser');
            }
            navigator.geolocation.getCurrentPosition((position) => {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                socket.emit('sendLocation', { latitude, longitude });
            });
        });