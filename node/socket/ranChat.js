const userMap = require('./userMap');

module.exports = (socket, io) => {
	console.log('연결됨:', socket.id);

  socket.on('register_nickname', (nickname) => {
    if (!nickname) return;
    console.log(`[닉네임 등록] ${nickname} -> ${socket.id}`);
    socket.nickname = nickname;
    userMap.set(nickname, socket.id);

    socket.emit('ready_for_match');
  });


  socket.on('send_message', ({ to, message }) => {
    const targetSocketId = userMap.get(to);
    if (targetSocketId) {
      const timestamp = new Date().toISOString();
      io.to(targetSocketId).emit('receive_message', {
        from: socket.nickname,
        message,
        time: timestamp
      });
    }
  });

  socket.on('disconnect', () => {
    if (socket.nickname) {
      userMap.delete(socket.nickname);
      console.log(`[연결 종료] ${socket.nickname}`);
    }
  });
  
};
