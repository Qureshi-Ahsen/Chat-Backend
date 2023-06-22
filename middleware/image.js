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
    const previewFolderPath = 'preview/';
    const fileExtension = path.extname(req.file.filename);
    const originalFilenameWithoutExtension = path.basename(req.file.filename, fileExtension);
    const previewFilename = originalFilenameWithoutExtension + '-preview' + fileExtension;
    const previewFilePath = path.join(previewFolderPath, previewFilename);
    try {
      await processImage(req.file.path, previewFilePath);
      req.file.path = previewFilePath;
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
        const fileExtension = path.extname(file.filename);
        const originalFilenameWithoutExtension = path.basename(file.filename, fileExtension);
        const previewFilename = originalFilenameWithoutExtension + '-preview' + fileExtension;
        const previewFilePath = path.join(previewFolderPath, previewFilename);
        await processImage(file.path, previewFilePath);
        file.path = previewFilePath;
      }
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
module.exports = {uploadMiddleware,bulkUploadMiddleware,};
