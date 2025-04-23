const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const archiverZipEncryptable = require('archiver-zip-encryptable');
const iconv = require('iconv-lite');

archiver.registerFormat('zip-encryptable', archiverZipEncryptable);

(async () => {
  const { files, uploadDir, tempZipPath, password } = workerData;

  const zipOutput = fs.createWriteStream(tempZipPath);
  const archive = archiver('zip-encryptable', {
    zlib: { level: 9 },
    forceLocalTime: true,
    password,
    forceLocalFileHeaderEncoding: true,
  });

  archive.pipe(zipOutput);

  try {
    files.forEach(file => {
      const filePath = path.join(uploadDir, file.filename);
      const decodedName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8');

      archive.file(filePath, {
        name: decodedName,
        stats: fs.statSync(filePath),
      });
    });

    await archive.finalize();
    await new Promise(resolve => zipOutput.on('close', resolve));

    parentPort.postMessage({ success: true });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();
