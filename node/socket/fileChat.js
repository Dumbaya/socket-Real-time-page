const userMap = require('./userMap');
const fs = require('fs');
const path = require('path');

function broadcastUserList(io) {
  const userList = userMap.keys();
  io.to('file_room').emit('update_user_list', userList);
}

function deleteUserFiles(nickname, uploadDir) {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return console.error('파일 목록 오류:', err);

    files.forEach((filename) => {
      const filePath = path.join(uploadDir, filename);
      if (fs.statSync(filePath).isFile()) {
        const parts = filename.split('_');
        const namePart = parts[parts.length - 1];
        const compareName = path.parse(namePart).name;

        if (compareName === nickname) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`[삭제 실패] ${filename}:`, err);
            else console.log(`[삭제됨] ${filename}`);
          });
        }
      }
    });
  });
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

  socket.on('zip_upload', ({ buffer, filename }) => {
    if (!socket.nickname || !filename || !buffer) return;

    const uploadDir = path.join(__dirname, '..', 'uploads');

    const safeFilename = filename.replace(/:/g, '-');
    const filePath = path.join(uploadDir, safeFilename);

    fs.writeFile(filePath, Buffer.from(buffer), (err) => {
      if (err) {
        console.error(`[fileChat] 파일 저장 실패: ${err}`);
        return;
      }

      const time = new Date().toISOString();
      const downloadURL = `/downloads/${safeFilename}`;

      console.log(`[fileChat] 파일 저장 완료: ${filePath}`);

      socket.emit('receive_message', {
        from: '나',
        filename: safeFilename,
        url: downloadURL,
        time: time
      });

      socket.broadcast.to(fileRoom).emit('receive_message', {
        from: socket.nickname,
        filename: safeFilename,
        url: downloadURL,
        time: time
      });
    });
  });

  socket.on('disconnect', () => {
    const nickname = socket.nickname;
    if (nickname) {
      console.log(`[연결 종료] ${nickname}`);
      userMap.delete(nickname);

      const uploadDir = path.join(__dirname, '..', 'uploads');
      deleteUserFiles(nickname, uploadDir);

      socket.to(fileRoom).emit('system_message', `${nickname}님이 퇴장했습니다.`);

      broadcastUserList(io);
    }
  });
};