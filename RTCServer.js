const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: "*" // "https://chatjsrctclient.itamarorenn.com",
    }
});

const users = new Map();
const socketsToUsers = {};

io.on('connection', socket => {
    console.log('A user connected with ID:', socket.id);

    socket.on('establishConnection', data => {
        if (data && data.uid) {
            users.set(data.uid, { socketid: socket.id });
            socketsToUsers[socket.id] = data.uid;
            socket.emit('yourData', { uid: data.uid });
            io.sockets.emit('allUsers', Array.from(users.keys()));
        }
    });

    socket.on('disconnect', () => {
        const uid = socketsToUsers[socket.id];
        users.delete(uid);
        delete socketsToUsers[socket.id];
        io.sockets.emit('userDisconnected', uid);
    });

    socket.on('callUser', data => {
        const userToCall = users.get(data.userToCall);
        if (userToCall) {
            io.to(userToCall.socketid).emit('callMade', {
                signal: data.signalData,
                from: data.from
            });
        }
    });

    socket.on('acceptCall', data => {
        const userToCall = users.get(data.to);
        if (userToCall) {
            io.to(userToCall.socketid).emit('callAccepted', {
                signal: data.signal,
                from: socket.id
            });
        }
    });

    socket.on('rejectCall', data => {
        const userToCall = users.get(data.to);
        if (userToCall) {
            io.to(userToCall.socketid).emit('callRejected', {
                from: socket.id
            });
        }
    });

    socket.on('endCall', data => {
        const userToCall = users.get(data.to);
        if (userToCall) {
            io.to(userToCall.socketid).emit('callEnded', {
                from: socket.id
            });
        }
    });

    // Handle WebRTC ICE candidate event
    socket.on('sendIceCandidate', data => {
        const userToCall = users.get(data.to);
        if (userToCall) {
            io.to(userToCall.socketid).emit('iceCandidateReceived', {
                candidate: data.candidate,
                from: socket.id
            });
        }
    });
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/clientTemp/index.html'); // Make sure to place 'index.html' in the correct directory
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});