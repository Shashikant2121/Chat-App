const socket = io('http://localhost:8000'); 

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Append messages to the chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
};

// Handle form submission to send messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message.trim()) { // Avoid sending empty messages
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

// Prompt user for their name and notify the server
let name = prompt("Enter your name to join");
while (!name || name.trim() === "") {
    name = prompt("Name cannot be empty. Please enter your name to join:");
}
socket.emit('new-user-joined', name);

// Listen for events from the server
socket.on('new-user-joined', (name) => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', (data) => {
    append(`${data.name}: ${data.message}`, 'left'); // Use 'name' instead of 'user'
});

socket.on('left', (name) => {
    append(`${name} left the chat`, 'left'); // Wrap 'left' in quotes
});
