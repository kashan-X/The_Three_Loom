// middlewares/uploadMiddleware.js
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Go one level up from middlewares/ to reach the project root, then public/Payment_Screenshots
const uploadDir = path.join(__dirname, '..', 'public', 'Payment_Screenshots');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const name = `payment_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext     = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;