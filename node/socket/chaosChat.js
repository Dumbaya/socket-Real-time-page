const userMap = require('./userMap');

function broadcastUserList(io) {
  const userList = userMap.keys();
  io.to('chaos_room').emit('update_user_list', userList);
}

module.exports = (socket, io) => {
  const chaosRoom = 'chaos_room';
	console.log('연결됨:', socket.id);

  socket.on('register_nickname', (nickname) => {
    if (!nickname) return;
    console.log(`[닉네임 등록] ${nickname} -> ${socket.id}`);
    socket.nickname = nickname;
    userMap.set(nickname, socket.id);

    socket.join(chaosRoom);
    socket.to(chaosRoom).emit('system_message', `${nickname}님이 입장했습니다.`);

    socket.emit('joined_chaos_chat', { room: chaosRoom });

    broadcastUserList(io);
  });

  socket.on('send_message', ({ message }) => {
    if (!socket.nickname || !message) return;

    const timestamp = new Date().toISOString();
    socket.broadcast.to(chaosRoom).emit('receive_message', {
      from: socket.nickname,
      message,
      time: timestamp,
    });
  });

  socket.on('disconnect', () => {
    const nickname = socket.nickname;
    if (nickname) {
      console.log(`[연결 종료] ${nickname}`);
      userMap.delete(nickname);

      socket.to(chaosRoom).emit('system_message', `${nickname}님이 퇴장했습니다.`);

      broadcastUserList(io);
    }
  });
};