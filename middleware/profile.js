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

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 100 },
  fileFilter: fileFilter,
});

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
    const resizedFilePath = 'avatar/' + req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
    try {
      const s3Path = 'uploads/' + resizedFilePath;
      const fileContent = req.file.buffer;

      // Upload the file to S3
      const params = {
        Bucket: bucketName,
        Key: s3Path,
        Body: fileContent,
      };
      await s3.upload(params).promise();

      // Process the uploaded file
      await processImage(fileContent, s3Path);

      req.file.path = s3Path;
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Image processing error: ' + error.message });
    }
  });
};

const processImage = async (fileBuffer, outputPath) => {
  await sharp(fileBuffer)
    .resize(null, 200)
    .flatten({ background: '#ff6600' })
    .sharpen()
    .withMetadata()
    .toFormat('webp', { quality: 90, background: '#ff6600' })
    .toBuffer(async (err, processedBuffer) => {
      if (err) {
        console.log(err);
        throw new Error('Image processing error: ' + err.message);
      }

      try {
        await s3.putObject({
          Bucket: bucketName,
          Key: outputPath,
          Body: processedBuffer,
        }).promise();
      } catch (error) {
        console.log(error);
        throw new Error('Image processing error: Failed to upload processed image to S3');
      }
    });
};

module.exports = { uploadMiddleware };
