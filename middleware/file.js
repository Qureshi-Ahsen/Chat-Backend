const multer = require('multer');
const path = require('path');
const aws = require('aws-sdk');

const s3 = new aws.S3();
const bucketName = 'cyclic-alive-pig-poncho-ap-northeast-1';

const storage = multer.memoryStorage();



const upload = multer({
    storage,
  });
  const uploadFileMiddleware = (req, res, next )=> {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.log(err);
        const errorMessage = err instanceof multer.MulterError ? 'Multer Error: ' : 'Error: ';
        return res.status(400).json({ error: errorMessage + err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No audio uploaded!' });
      }
      const FilePath = 'file/' + req.file.fieldname + '-' + Date.now() + path.extname(req.file.originalname);
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
    })
   
};

  module.exports={uploadFileMiddleware}
