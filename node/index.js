const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const ranChatHandler = require('./socket/ranChat');
const ranChatRoute = require('./routes/ranChat');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[요청 로그] ${req.method} ${req.url}`);
  next();
});
app.use('/ranChat', ranChatRoute(io));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  ranChatHandler(socket, io);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
