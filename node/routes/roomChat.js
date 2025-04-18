const express = require('express');
const userMap = require('../socket/userMap');
const roomMap = require('../socket/roomMap');
const router = express.Router();

module.exports = (io) => {
  router.post('/', (req, res) => {
    const { my_nickname, room_title } = req.body;

    console.log('[채팅 참가 요청]', my_nickname);

    if (!my_nickname) console.log('[에러] my_nickname userMap에 닉네임 없음');
    if (!room_title) console.log('[에러] room_title roomMap에 방 제목 없음');

    const socketId = userMap.get(my_nickname);
    const roomID = roomMap.get(room_title);

    if (!socketId) console.log('[에러] socketId userMap에 닉네임 없음');
    if (!roomID) console.log('[에러] roomID roomMap에 방 제목 없음');
    if (socketId && roomID) {
      res.json({ message: '채팅 참가 완료' });
    } else {
      res.status(400).json({ message: '해당 닉네임의 소켓을 찾을 수 없습니다.' });
    }
  });

  return router;
};