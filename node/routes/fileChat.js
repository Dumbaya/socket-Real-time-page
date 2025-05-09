const express = require('express');
const userMap = require('../socket/userMap');
const router = express.Router();

module.exports = (io) => {
  router.post('/', (req, res) => {
    const { my_nickname } = req.body;

    console.log('[채팅 참가 요청]', my_nickname);

    const socketId = userMap.get(my_nickname);
    if (socketId) {
      res.json({ message: '채팅 참가 완료' });
    } else {
      res.status(400).json({ message: '해당 닉네임의 소켓을 찾을 수 없습니다.' });
    }
  });

  return router;
};