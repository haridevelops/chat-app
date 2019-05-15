const socket = io();
const $messageForm = document.querySelector('form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $locationButton = document.getElementById("send-location");

socket.on('newUser', (message) => {
    console.log(message);
})

$messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute('disabled', 'disabled');
    let message = event.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) return console.log(error);
        
        console.log('Message Delivered');
    });
})


$locationButton.addEventListener('click', (event) => {
            if (!navigator.geolocation) {
                return alert('Feature not supported in this browser');
            }
            $locationButton.setAttribute('disabled', 'disabled');
            setTimeout(geolocationFinder, 1000);
        });


function geolocationFinder() {
    navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        socket.emit('sendLocation', { latitude, longitude }, (error) => {
            $locationButton.removeAttribute('disabled');
            
            if (error) return console.log(error);
            console.log('Location Shared');
        });
    });
}