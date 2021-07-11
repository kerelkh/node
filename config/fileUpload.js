const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
})

const thumbnailUpload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
      return cb(null, true);
    }
    cb(null, false);
  }
}).single('thumbnail');


module.exports = {
  thumbnailUpload
}