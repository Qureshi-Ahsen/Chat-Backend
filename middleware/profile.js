const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

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
      const resizedFilePath = 'avatar/'+req.file.fieldname+'-' + Date.now() + path.extname(req.file.originalname);
      try {
        await processImage(req.file.path, resizedFilePath); 
        req.file.path = resizedFilePath;
        next();
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Image processing error: ' + error.message });
      }
    });
  };


const processImage = async (inputPath, outputPath) => {
  await sharp(inputPath)
  .resize(null, 200)
  .flatten({ background: '#ff6600' }).sharpen().withMetadata().toFormat('webp', { quality: 90, background: '#ff6600' }).toFile(outputPath);
};
module.exports = {uploadMiddleware};