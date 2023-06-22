const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'file/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});



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
      console.log('hi')
      next(); 
    })
   
};

  module.exports={uploadFileMiddleware}
