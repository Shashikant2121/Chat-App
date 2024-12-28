const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // Replace with your frontend's origin
        methods: ["GET", "POST"]
    }
});

app.use(cors());
const users = {};

io.on('connection', (socket) => {
    // Handle new user joining
    socket.on('new-user-joined', (name) => {
        if (name) {
            users[socket.id] = name;
            socket.broadcast.emit('new-user-joined', name);
        }
    });

    // Handle sending messages
    socket.on('send', (message) => {
        if (users[socket.id] && message) {
            socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
        }
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        }
    });
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});
