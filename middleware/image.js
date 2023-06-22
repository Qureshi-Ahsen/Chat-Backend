const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const aws = require('aws-sdk');

const s3 = new aws.S3();
const bucketName = 'cyclic-alive-pig-poncho-ap-northeast-1';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|jfif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb('Error: Only image files are allowed!');
  }
};

const upload = multer({ storage, fileFilter });

const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      console.log(err);
      const errorMessage = err instanceof multer.MulterError ? 'Multer Error: ' : 'Error: ';
      return res.status(400).json({ error: errorMessage + err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded!' });
    }
    const FilePath = 'image/' + req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
    try {
      const s3Path = 'uploads/' + FilePath;
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
      return res.status(500).json({ error: 'Image processing error: ' + error.message });
    }
  });
};

const bulkUploadMiddleware = (req, res, next) => {
  upload.array('images')(req, res, async (err) => {
    if (err) {
      const errorMessage = err instanceof multer.MulterError ? 'Multer Error: ' : 'Error: ';
      return res.status(400).json({ error: errorMessage + err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded!' });
    }
    const previewFolderPath = 'preview/';
     try {
      for (const file of req.files) {
        const FilePath = 'image/' + req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
        const s3Path = 'uploads/' + FilePath;
        const fileContent = req.file.buffer;
        const params = {
          Bucket: bucketName,
          Key: s3Path,
          Body: fileContent,
        };
        await s3.upload(params).promise();
        req.file.path = s3Path;
      }
     next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Image processing error: ' + error.message });
    }
  });
};

module.exports = {uploadMiddleware,bulkUploadMiddleware,};
