const multer = require('multer');
const path = require('path')

const tmpDir = path.join(process.cwd(), "tmp")

const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tmpDir)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" 
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadImg = multer({
    storage: multerConfig, fileFilter
})

module.exports = {
    uploadImg
}