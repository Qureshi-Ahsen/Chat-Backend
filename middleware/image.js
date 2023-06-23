const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk');

const s3 = new aws.S3();
const bucketName = 'cyclic-alive-pig-poncho-ap-northeast-1';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image', 'video', 'audio','file'];
  const mimetype = file.mimetype.split('/')[0]; 

  if (allowedTypes.includes(mimetype)) {
    cb(null, true);
  } else {
    cb('Error: Only image, video, and audio and files are allowed!');
  }
};

const upload = multer({ storage, fileFilter });
const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.log(err);
      const errorMessage = err instanceof multer.MulterError ? 'Multer Error: ' : 'Error: ';
      return res.status(400).json({ error: errorMessage + err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded!' });
    }
    const timestamp = Date.now();
    const filePath = `file/${req.file.fieldname}-${timestamp}${path.extname(req.file.originalname)}`;
    try {
      const s3Path = `uploads/${filePath}`;
      const fileContent = req.file.buffer;
      const params = {
        Bucket: bucketName,
        Key: s3Path,
        Body: fileContent,
      };
      await s3.upload(params).promise();
      req.file.path = s3Path;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'File processing error: ' + error.message });
    }
  });
};




const bulkUploadMiddleware = (req, res, next) => {
  upload.array('files')(req, res, async (err) => {
    if (err) {
      const errorMessage = err instanceof multer.MulterError ? 'Multer Error: ' : 'Error: ';
      return res.status(400).json({ error: errorMessage + err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded!' });
    }
    try {
      for (const file of req.files) {
        const filePath = 'file/' + file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        const s3Path = 'uploads/' + filePath;
        const fileContent = file.buffer;
        const params = {
          Bucket: bucketName,
          Key: s3Path,
          Body: fileContent,
        };
        await s3.upload(params).promise();
        file.path = s3Path;
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'File processing error: ' + error.message });
    }
  });
};



module.exports = {uploadMiddleware,bulkUploadMiddleware,};
