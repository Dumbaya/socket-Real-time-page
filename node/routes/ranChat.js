const express = require('express');
const userMap = require('../socket/userMap');
const router = express.Router();

module.exports = (io) => {
  router.post('/', (req, res) => {
    const { my_nickname, partner_nickname } = req.body;

    console.log('POST 요청 받음:', my_nickname, partner_nickname);

    const mySocket = userMap.get(my_nickname);
    const partnerSocket = userMap.get(partner_nickname);

    if (mySocket) {
      io.to(mySocket).emit('matched', { partner: partner_nickname });
    } else {
      console.log(`[매칭실패] ${my_nickname}의 소켓 없음`);
    }
    
    if (partnerSocket) {
      io.to(partnerSocket).emit('matched', { partner: my_nickname });
    } else {
      console.log(`[매칭실패] ${partner_nickname}의 소켓 없음`);
    }
    

    res.json({ message: '매칭 완료' });
  });

  return router;
};
