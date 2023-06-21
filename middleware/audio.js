const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'audio/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.mp3'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
  
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb('Error: Only audio files with .mp3 extension are allowed!');
    }
  };

const upload = multer({
    storage,
    fileFilter
  });
  
  const uploadAudioMiddleware = (req, res, next )=> {
    upload.single('audio')(req, res, async (err) => {
      if (err) {
        console.log(err);
        const errorMessage = err instanceof multer.MulterError ? 'Multer Error: ' : 'Error: ';
        return res.status(400).json({ error: errorMessage + err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No audio uploaded!' });
      }
      next(); 
    })
   
};

  module.exports={uploadAudioMiddleware}