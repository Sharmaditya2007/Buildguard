const express = require('express');
const router = express.Router();
const {
  getAssignedProjects,
  uploadMaterialDelivery,
  uploadConstructionProgress,
  createMaterialRequest,
  getPreviousUploads
} = require('../controllers/contractorController');
const { protect, contractorOnly } = require('../middlewares/auth');
const { uploadSingleImage, uploadMultiplePhotos } = require('../middlewares/upload');
const {
  validateMaterialDelivery,
  validateProgressUpload,
  validateMaterialRequest
} = require('../middlewares/validate');

// Protect all contractor routes with JWT verification and Contractor RBAC
router.use(protect);
router.use(contractorOnly);

/**
 * @route   GET /api/v1/contractor/projects
 * @desc    Feature 1: View all projects assigned to authenticated contractor
 * @access  Private (Contractor only)
 */
router.get('/projects', getAssignedProjects);

/**
 * @route   POST /api/v1/contractor/materials/upload
 * @desc    Feature 2: Upload material delivery (stores image in Cloudinary, runs AI verification)
 * @access  Private (Contractor only)
 */
router.post(
  '/materials/upload',
  uploadSingleImage('image'),
  validateMaterialDelivery,
  uploadMaterialDelivery
);

/**
 * @route   POST /api/v1/contractor/progress/upload
 * @desc    Feature 3: Upload site progress photos and notes (Cloudinary + AI stage/progress detection)
 * @access  Private (Contractor only)
 */
router.post(
  '/progress/upload',
  uploadMultiplePhotos('photos', 10),
  validateProgressUpload,
  uploadConstructionProgress
);

/**
 * @route   POST /api/v1/contractor/materials/request
 * @desc    Feature 4: Create material requisition with automated AI consumption & anomaly check
 * @access  Private (Contractor only)
 */
router.post(
  '/materials/request',
  validateMaterialRequest,
  createMaterialRequest
);

/**
 * @route   GET /api/v1/contractor/uploads
 * @desc    Feature 5: View previous uploads (material deliveries and progress updates)
 * @access  Private (Contractor only)
 */
router.get('/uploads', getPreviousUploads);

module.exports = router;
