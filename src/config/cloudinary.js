const cloudinary = require('cloudinary').v2;
const streamifier = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads a buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer File buffer from multer
 * @param {Object} options Cloudinary upload options
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // If running in development without valid credentials configured, provide a realistic mock URL
    const isMock =
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloudinary_cloud_name' ||
      process.env.CLOUDINARY_CLOUD_NAME === 'buildguard_demo';

    if (isMock && process.env.NODE_ENV !== 'production') {
      const folder = options.folder || 'buildguard_materials';
      const mockId = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const mockUrl = `https://res.cloudinary.com/buildguard-demo/image/upload/v1710000000/${mockId}.jpg`;
      return resolve({
        secure_url: mockUrl,
        public_id: mockId,
        format: 'jpg',
        bytes: buffer ? buffer.length : 1024
      });
    }

    const defaultOptions = {
      folder: 'buildguard',
      resource_type: 'image',
      ...options
    };

    const stream = cloudinary.uploader.upload_stream(defaultOptions, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    // Pipe the buffer into Cloudinary upload stream
    const readable = new streamifier.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};
