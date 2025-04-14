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
    if (nickname) {
      if (userMap.has(nickname)) {
        userMap.delete(nickname);
      }
      console.log(`[연결 종료] ${nickname}`);

      const partner = partnerMap.get(nickname);
      if (partner) {
        const partnerSocketId = userMap.get(partner);
        if (partnerSocketId) {
          io.to(partnerSocketId).emit('partner_disconnected', {
            message: `${nickname}님이 대화를 종료했습니다.`,
          });
        }
        if (partnerMap.has(nickname)) partnerMap.delete(nickname);
        if (partnerMap.has(partner)) partnerMap.delete(partner);
      }
    }
  });
  
};
