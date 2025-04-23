const express = require('express');
const userMap = require('../socket/userMap');
const roomMap = require('../socket/roomMap');
const router = express.Router();
const archiver = require('archiver');
const multer = require('multer');
const iconv = require('iconv-lite');
const archiverZipEncryptable = require('archiver-zip-encryptable');
const yazl = require('yazl');
const path = require('path');
const fs = require('fs');

archiver.registerFormat('zip-encryptable', archiverZipEncryptable);

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
  
  router.post('/upload', multer({ dest: 'uploads/' }).array('files'), async (req, res) => {
    const files = req.files;
    const { password, room_title: room, nickname, filename } = req.body;
  
    if (!files || !files.length || !password || !room || !nickname || !filename) {
      return res.status(400).json({ message: '필수 항목 누락' });
    }

    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
  
    const tempZipPath = path.join(uploadDir, `${filename}.zip`);
    const zipOutput = fs.createWriteStream(tempZipPath);
  
    const archive = archiver('zip-encryptable', {
      zlib: { level: 9 },
      forceLocalTime: true,
      password,
      forceLocalFileHeaderEncoding: true
    });
  
    archive.pipe(zipOutput);
  
    files.forEach(file => {
      const filePath = path.join(uploadDir, file.filename);
      const decodedFileName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8');
      archive.file(filePath, {
        name: decodedFileName,
        stats: fs.statSync(filePath),
      });
    });
  
    try {
      await archive.finalize();
      await new Promise(resolve => zipOutput.on('close', resolve));
  
      files.forEach(file => fs.unlinkSync(file.path));
  
      io.to(room).emit('receive_file', {
        filename: `${filename}.zip`,
        url: `/downloads/${filename}.zip`,
        time: new Date().toISOString(),
        from: nickname,
      });
  
      res.json({
        success: true,
        filename: `${filename}.zip`,
        downloadURL: `/downloads/${filename}.zip`
      });
    } catch (err) {
      console.error('[압축 실패]', err);
      res.status(500).json({ message: '압축 중 오류 발생' });
    }
  });

  return router;
};