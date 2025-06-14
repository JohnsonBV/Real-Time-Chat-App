const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Main HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', socket => {
  console.log('User connected');

  socket.on('joinRoom', ({ username, room }) => {
    socket.username = username;
    socket.room = room;
    socket.join(room);

    socket.to(room).emit('chat message', {
      username: 'System',
      text: `${username} joined the room`,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  socket.on('chat message', msg => {
    const message = {
      username: socket.username,
      text: msg,
      timestamp: new Date().toLocaleTimeString()
    };
    io.to(socket.room).emit('chat message', message);
  });

  socket.on('typing', () => {
    socket.to(socket.room).emit('typing', socket.username);
  });

  socket.on('stop typing', () => {
    socket.to(socket.room).emit('stop typing');
  });

  socket.on('disconnect', () => {
    if (socket.username && socket.room) {
      socket.to(socket.room).emit('chat message', {
        username: 'System',
        text: `${socket.username} left the room`,
        timestamp: new Date().toLocaleTimeString()
      });
    }
  });
});

server.listen(3000, () => {
  console.log('Chat app running on port 3000');
});
