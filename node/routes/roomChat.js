const express = require('express');
const userMap = require('../socket/userMap');
const roomMap = require('../socket/roomMap');
const router = express.Router();
const archiver = require('archiver');
const multer = require('multer');
const iconv = require('iconv-lite');
const archiverZipEncryptable = require('archiver-zip-encryptable');
const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads');
const { resetIdleTimer, getRemainingTime } = require('../util/resetIdleTimer');

archiver.registerFormat('zip-encryptable', archiverZipEncryptable);

const upload = multer({
  dest: path.join('/app/node', 'uploads'),
  limits: { fileSize: 1024 * 1024 * 300 }
});

module.exports = (io) => {
  router.post('/', (req, res) => {
    const { my_nickname, room_title } = req.body;

    console.log('[채팅 참가 요청]', my_nickname);

    if (!my_nickname) console.log('[에러] my_nickname userMap에 닉네임 없음');
    if (!room_title) console.log('[에러] room_title roomMap에 방 제목 없음');

    const socketId = userMap.get(my_nickname);
    const roomID = roomMap.get(room_title);
    resetIdleTimer();
    const remainingTime = getRemainingTime();
    const remainingTime_msg = `Remaining time: ${remainingTime / 1000} seconds`
    socket.emit('idletimer', remainingTime_msg);

    if (!socketId) console.log('[에러] socketId userMap에 닉네임 없음');
    if (!roomID) console.log('[에러] roomID roomMap에 방 제목 없음');
    if (socketId && roomID) {
      res.json({ message: '채팅 참가 완료' });
    } else {
      res.status(400).json({ message: '해당 닉네임의 소켓을 찾을 수 없습니다.' });
    }
  });
  
  router.post('/upload', upload.array('files'), async (req, res) => {
    const files = req.files;
    const { password, room_title: room, nickname, filename } = req.body;
  
    if (!files || !files.length || !password || !room || !nickname || !filename) {
      return res.status(400).json({ message: '필수 항목 누락' });
    }

    const uploadDir = path.join('/app/node', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  
    const tempZipPath = path.join(uploadDir, `${filename}.zip`);

    const worker = new Worker(path.join('/app/node/util', 'zipWorker.js'), {
      workerData: {
        files,
        uploadDir,
        tempZipPath,
        password,
      }
    });

    worker.on('message', msg => {
      if (msg.success) {
        files.forEach(file => fs.unlinkSync(file.path));
        resetIdleTimer();
        const remainingTime = getRemainingTime();
        const remainingTime_msg = `Remaining time: ${remainingTime / 1000} seconds`
        socket.emit('idletimer', remainingTime_msg);

        io.to(room).emit('receive_file', {
          filename: `${filename}.zip`,
          url: `/downloads/${filename}.zip`,
          time: new Date().toISOString(),
          from: nickname,
        });

        res.json({
          success: true,
          filename: `${filename}.zip`,
          downloadURL: `/downloads/${filename}.zip`,
        });
      } else {
        console.error('[압축 실패]', msg.error);
        res.status(500).json({ message: '압축 중 오류 발생' });
      }
    });

    worker.on('error', err => {
      console.error('[워커 오류]', err);
      res.status(500).json({ message: '압축 워커 오류 발생' });
    });

    worker.on('exit', code => {
      if (code !== 0) {
        console.error(`[워커 비정상 종료] code: ${code}`);
      }
    });
  });

  return router;
};