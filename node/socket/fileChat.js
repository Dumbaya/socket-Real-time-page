const userMap = require('./userMap');
const fs = require('fs');
const path = require('path');

function broadcastUserList(io) {
  const userList = userMap.keys();
  io.to('file_room').emit('update_user_list', userList);
}

module.exports = (socket, io) => {
  const fileRoom = 'file_room';
	console.log('연결됨:', socket.id);

  socket.on('register_nickname', (nickname) => {
    if (!nickname) return;
    console.log(`[닉네임 등록] ${nickname} -> ${socket.id}`);
    socket.nickname = nickname;
    userMap.set(nickname, socket.id);

    socket.join(fileRoom);
    socket.to(fileRoom).emit('system_message', `${nickname}님이 입장했습니다.`);

    socket.emit('joined_file_chat', { room: fileRoom });

    broadcastUserList(io);
  });

  socket.on('zip-upload', ({ filename, url, time }) => {
    if (!socket.nickname || !filename) return;

    socket.broadcast.to(fileRoom).emit('receive_message', {
      from: socket.nickname,
      filename: filename,
      url: url,
      time: time,
    });
  });

  socket.on('disconnect', () => {
    const nickname = socket.nickname;
    if (nickname) {
      console.log(`[연결 종료] ${nickname}`);
      userMap.delete(nickname);

      socket.to(fileRoom).emit('system_message', `${nickname}님이 퇴장했습니다.`);

      broadcastUserList(io);
    }
  });
};