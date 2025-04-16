const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const ranChatHandler = require('./socket/ranChat');
const ranChatRoute = require('./routes/ranChat');
const chaosChatHandler = require('./socket/chaosChat');
const chaosChatRoute = require('./routes/chaosChat');
const fileChatHandler = require('./socket/fileChat');
const fileChatRoute = require('./routes/fileChat');

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

const ranChatNamespace = io.of('/ranChat');
const chaosChatNamespace = io.of('/chaosChat');
const fileChatNamespace = io.of('/fileChat');

app.use('/ranChat', ranChatRoute(ranChatNamespace));
app.use('/chaosChat', chaosChatRoute(chaosChatNamespace));
app.use('/fileChat', fileChatRoute(fileChatNamespace));

ranChatNamespace.on('connection', (socket) => {
  console.log('[ranChat] User connected:', socket.id);
  ranChatHandler(socket, ranChatNamespace);
});

chaosChatNamespace.on('connection', (socket) => {
  console.log('[chaosChat] User connected:', socket.id);
  chaosChatHandler(socket, chaosChatNamespace);
});

fileChatNamespace.on('connection', (socket) => {
  console.log('[fileChat] User connected:', socket.id);
  fileChatHandler(socket, fileChatNamespace);
})

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
