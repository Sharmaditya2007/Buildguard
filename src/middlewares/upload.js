const multer = require('multer');
const ApiError = require('../utils/apiError');

// Memory storage to process buffers directly with Cloudinary
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Invalid file type: ${file.mimetype}. Only JPEG, PNG, and WebP images are allowed.`
      ),
      false
    );
  }
};

const limits = {
  fileSize: 10 * 1024 * 1024 // 10 MB limit per file
};

const upload = multer({
  storage,
  fileFilter,
  limits
});

const uploadSingleImage = (fieldName = 'image') => upload.single(fieldName);
const uploadMultiplePhotos = (fieldName = 'photos', maxCount = 10) =>
  upload.array(fieldName, maxCount);

module.exports = {
  upload,
  uploadSingleImage,
  uploadMultiplePhotos
};
