const userMap = require('./userMap');
const partnerMap = require('./partnerMap');

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

  socket.on('exit_chat', ({ nickname, partnerNickname }) => {
    cleanupChat(nickname, partnerNickname, io);
  });

  socket.on('disconnect', () => {
    console.log(`[연결 끊김] ${socket.nickname}`);
    const nickname = socket.nickname;
    const partner = partnerMap.get(nickname);

    cleanupChat(nickname, partner, io);
  });
};

function cleanupChat(nickname, partnerNickname, io) {
  if (!nickname) return;

  userMap.delete(nickname);

  if (partnerNickname) {
    const partnerSocketId = userMap.get(partnerNickname);
    if (partnerSocketId) {
      io.to(partnerSocketId).emit('partner_disconnected', {
        message: `${nickname}님이 연결을 종료했습니다.`,
      });
    }

    partnerMap.delete(nickname);
    partnerMap.delete(partnerNickname);
  }
}