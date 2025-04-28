const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { resetIdleTimer, getRemainingTime } = require('./util/resetIdleTimer');

const ranChatHandler = require('./socket/ranChat');
const ranChatRoute = require('./routes/ranChat');
const chaosChatHandler = require('./socket/chaosChat');
const chaosChatRoute = require('./routes/chaosChat');
const fileChatHandler = require('./socket/fileChat');
const fileChatRoute = require('./routes/fileChat');
const roomChatHandler = require('./socket/roomChat');
const roomChatRoute = require('./routes/roomChat');

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = socketIO(server, {
  cors: {
    origin: ['http://sockettest'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(express.json());
app.use((req, res, next) => {
  const decodedUrl = decodeURIComponent(req.url);
  console.log(`[요청 로그] ${req.method} ${decodedUrl}`);
  next();
});

const uploadDir = path.join('/app/node', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/downloads', express.static(uploadDir));

const ranChatNamespace = io.of('/ranChat');
const chaosChatNamespace = io.of('/chaosChat');
const fileChatNamespace = io.of('/fileChat');
const roomChatNamespace = io.of('/roomChat');

app.use('/ranChat', ranChatRoute(ranChatNamespace));
app.use('/chaosChat', chaosChatRoute(chaosChatNamespace));
app.use('/fileChat', fileChatRoute(fileChatNamespace));
app.use('/roomChat', roomChatRoute(roomChatNamespace));

ranChatNamespace.on('connection', (socket) => {
  console.log('[ranChat] User connected:', socket.id);
  ranChatHandler(socket, ranChatNamespace);
  resetIdleTimer();
  const remainingTime = getRemainingTime();
  console.log(`Remaining time: ${remainingTime / 1000} seconds`);
});

chaosChatNamespace.on('connection', (socket) => {
  console.log('[chaosChat] User connected:', socket.id);
  chaosChatHandler(socket, chaosChatNamespace);
  resetIdleTimer();
  const remainingTime = getRemainingTime();
  console.log(`Remaining time: ${remainingTime / 1000} seconds`);
});

fileChatNamespace.on('connection', (socket) => {
  console.log('[fileChat] User connected:', socket.id);
  fileChatHandler(socket, fileChatNamespace);
  resetIdleTimer();
  const remainingTime = getRemainingTime();
  console.log(`Remaining time: ${remainingTime / 1000} seconds`);
})

roomChatNamespace.on('connection', (socket) => {
  console.log('[roomChat] User connected:', socket.id);
  roomChatHandler(socket, roomChatNamespace);
  resetIdleTimer();
  const remainingTime = getRemainingTime();
  console.log(`Remaining time: ${remainingTime / 1000} seconds`);
})

server.listen(3000, () => {
  console.log('Server is running on port 3000');
  resetIdleTimer();
  const remainingTime = getRemainingTime();
  console.log(`Remaining time: ${remainingTime / 1000} seconds`);
});
