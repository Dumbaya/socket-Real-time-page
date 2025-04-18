const userMap = require('./userMap');
const roomMap = require('./roomMap');
const fs = require('fs');
const path = require('path');

function broadcastUserList(io, room_title) {
  const userList = roomMap.getUsersInRoom(room_title);
  io.to(room_title).emit('update_user_list', userList);
}

function broadcastRoomList(io) {
  const roomList = roomMap.getRooms();
  console.log(roomList);
  io.emit('update_room_list', roomList);
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
  console.log('연결됨:', socket.id);

  socket.on('reconnect_user', ({ nickname }) => {
    if (!nickname) return;
    console.log(`[재연결된 유저] ${nickname} - ${socket.id}`);
    socket.nickname = nickname;
    userMap.set(nickname, socket.id);
  });

  socket.on('request_room_list', () => {
    broadcastRoomList(io);
  });

  socket.on('join_room', ({ nickname, room_title }) => {
    if (!nickname || !room_title) {
      console.log("nickname: "+nickname+", room_title: "+room_title);
      return;
    }

    console.log(`[닉네임 등록] ${nickname} -> ${socket.id}`);
    socket.nickname = nickname;
    socket.title = room_title;

    userMap.set(nickname, socket.id);
    roomMap.addUserToRoom(room_title, nickname);

    socket.join(room_title);
    socket.to(room_title).emit('system_message', `${room_title} - ${nickname}님이 입장했습니다.`);

    socket.emit('joined_room_chat', { room: room_title });

    broadcastUserList(io, room_title);
    broadcastRoomList(io);
  });

  socket.on('send_message', ({ nickname, message }) => {
    if (!socket.nickname || !message) return;

    const title = socket.title;

    const timestamp = new Date().toISOString();

    socket.emit('receive_message', {
      from: '나',
      message,
      time: timestamp,
    });
      
    socket.broadcast.to(title).emit('receive_message', {
      from: socket.nickname,
      message,
      time: timestamp,
    });
  });

  socket.on('send_file', ({ nickname, buffer, filename }) => {
    if (!socket.nickname || !filename || !buffer) return;

    const title = socket.title;

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

      socket.emit('receive_file', {
        from: '나',
        filename: safeFilename,
        url: downloadURL,
        time: time
      });
        
      socket.broadcast.to(title).emit('receive_file', {
        from: socket.nickname,
        filename: safeFilename,
        url: downloadURL,
        time: time
      });
    });
  });

  socket.on('disconnect', () => {
    const nickname = socket.nickname;
    const title = socket.title;
    if (nickname && title) {
      console.log(`[연결 종료] ${nickname}`);
      userMap.delete(nickname);
      roomMap.removeUserFromRoom(title, nickname);

      const uploadDir = path.join(__dirname, '..', 'uploads');
      deleteUserFiles(nickname, uploadDir);

      socket.to(title).emit('system_message', `${nickname}님이 퇴장했습니다.`);

      broadcastUserList(io, title);
      broadcastRoomList(io);
    }
  });
};
