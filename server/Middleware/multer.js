const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const cloudinary = require('../Config/cloudinary')

// Define allowed file types (Images only)
const allowedFileTypes = /jpeg|jpg|png|gif|webp/;

const storage = multer.memoryStorage(); // Store file in memory for Cloudinary

const fileFilter = (req, file, cb) => {
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only image files (JPG, PNG, GIF, WEBP) are allowed")); // Reject file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});


module.exports = upload;
