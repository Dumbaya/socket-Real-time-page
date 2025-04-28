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

    console.log('[ä�� ���� ��û]', my_nickname);

    if (!my_nickname) console.log('[����] my_nickname userMap�� �г��� ����');
    if (!room_title) console.log('[����] room_title roomMap�� �� ���� ����');

    const socketId = userMap.get(my_nickname);
    const roomID = roomMap.get(room_title);
    resetIdleTimer();
    const remainingTime = getRemainingTime();
    const remainingTime_msg = `Remaining time: ${remainingTime / 1000} seconds`
    socket.emit('idletimer', remainingTime_msg);

    if (!socketId) console.log('[����] socketId userMap�� �г��� ����');
    if (!roomID) console.log('[����] roomID roomMap�� �� ���� ����');
    if (socketId && roomID) {
      res.json({ message: 'ä�� ���� �Ϸ�' });
    } else {
      res.status(400).json({ message: '�ش� �г����� ������ ã�� �� �����ϴ�.' });
    }
  });
  
  router.post('/upload', upload.array('files'), async (req, res) => {
    const files = req.files;
    const { password, room_title: room, nickname, filename } = req.body;
  
    if (!files || !files.length || !password || !room || !nickname || !filename) {
      return res.status(400).json({ message: '�ʼ� �׸� ����' });
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
        console.error('[���� ����]', msg.error);
        res.status(500).json({ message: '���� �� ���� �߻�' });
      }
    });

    worker.on('error', err => {
      console.error('[��Ŀ ����]', err);
      res.status(500).json({ message: '���� ��Ŀ ���� �߻�' });
    });

    worker.on('exit', code => {
      if (code !== 0) {
        console.error(`[��Ŀ ������ ����] code: ${code}`);
      }
    });
  });

  return router;
};