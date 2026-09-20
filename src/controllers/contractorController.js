const Project = require('../models/Project');
const MaterialUpload = require('../models/MaterialUpload');
const ProgressUpdate = require('../models/ProgressUpdate');
const MaterialRequest = require('../models/MaterialRequest');
const { uploadToCloudinary } = require('../config/cloudinary');
const {
  verifyMaterialDelivery,
  evaluateSiteProgress,
  evaluateMaterialRequest
} = require('../services/aiService');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * FEATURE 1: View Assigned Projects
 * @desc    Get all projects assigned to the authenticated contractor
 * @route   GET /api/v1/contractor/projects
 * @access  Private (Contractor only)
 */
const getAssignedProjects = asyncHandler(async (req, res) => {
  const contractorId = req.user._id;

  const projects = await Project.find({ contractorId })
    .populate('homeownerId', 'name email')
    .sort({ createdAt: -1 });

  return ApiResponse.ok(
    res,
    {
      count: projects.length,
      projects
    },
    'Assigned projects retrieved successfully'
  );
});

/**
 * FEATURE 2: Upload Material Delivery
 * @desc    Contractor uploads material delivery photo with receipt details; saves to Cloudinary & triggers AI verification
 * @route   POST /api/v1/contractor/materials/upload
 * @access  Private (Contractor only)
 */
const uploadMaterialDelivery = asyncHandler(async (req, res) => {
  const { projectId, materialType, quantity, unit } = req.body;
  const contractorId = req.user._id;

  // 1. Verify project exists and belongs to this contractor
  const project = await Project.findOne({
    _id: projectId,
    contractorId
  });

  if (!project) {
    throw ApiError.notFound(
      'Project not found or you are not authorized as the assigned contractor for this project'
    );
  }

  // 2. Upload image to Cloudinary
  if (!req.file) {
    throw ApiError.badRequest('Please upload an image file of the material delivery');
  }

  const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
    folder: `buildguard/projects/${projectId}/materials`
  });

  // 3. AI visual audit and verification
  const aiAudit = await verifyMaterialDelivery({
    imageUrl: cloudinaryResult.secure_url,
    materialType,
    quantity: Number(quantity),
    unit: unit || 'units'
  });

  // 4. Persist MaterialUpload record
  const materialUpload = await MaterialUpload.create({
    projectId,
    materialType,
    quantity: Number(quantity),
    unit: unit || 'units',
    imageUrl: cloudinaryResult.secure_url,
    cloudinaryPublicId: cloudinaryResult.public_id,
    aiVerificationResult: aiAudit,
    uploadedBy: contractorId
  });

  return ApiResponse.created(
    res,
    {
      materialUpload
    },
    'Material delivery recorded and verified by AI successfully'
  );
});

/**
 * FEATURE 3: Upload Construction Progress
 * @desc    Contractor uploads construction progress photos & notes; saves to Cloudinary & triggers AI progress evaluation
 * @route   POST /api/v1/contractor/progress/upload
 * @access  Private (Contractor only)
 */
const uploadConstructionProgress = asyncHandler(async (req, res) => {
  const { projectId, notes } = req.body;
  const contractorId = req.user._id;

  // 1. Verify project exists and contractor is assigned
  const project = await Project.findOne({
    _id: projectId,
    contractorId
  });

  if (!project) {
    throw ApiError.notFound(
      'Project not found or you are not authorized as the assigned contractor for this project'
    );
  }

  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest('Please provide at least one site progress photo');
  }

  // 2. Upload all photos to Cloudinary in parallel
  const uploadPromises = req.files.map((file) =>
    uploadToCloudinary(file.buffer, {
      folder: `buildguard/projects/${projectId}/progress`
    })
  );

  const uploadResults = await Promise.all(uploadPromises);
  const imageUrls = uploadResults.map((result) => result.secure_url);
  const publicIds = uploadResults.map((result) => result.public_id);

  // 3. Run AI site inspection & progress detection
  const aiProgress = await evaluateSiteProgress({
    images: imageUrls,
    notes,
    currentStage: project.currentStage
  });

  // 4. Update project stage if AI detects advancement
  if (aiProgress.detectedStage && project.currentStage !== aiProgress.detectedStage) {
    project.currentStage = aiProgress.detectedStage;
    await project.save();
  }

  // 5. Create ProgressUpdate record
  const progressUpdate = await ProgressUpdate.create({
    projectId,
    images: imageUrls,
    cloudinaryPublicIds: publicIds,
    notes: notes || '',
    detectedStage: aiProgress.detectedStage,
    progressPercentage: aiProgress.progressPercentage,
    aiSummary: aiProgress.aiSummary,
    uploadedBy: contractorId
  });

  return ApiResponse.created(
    res,
    {
      progressUpdate,
      currentProjectStage: project.currentStage
    },
    'Site progress photos uploaded and analyzed by AI successfully'
  );
});

/**
 * FEATURE 4: Create Material Request
 * @desc    Contractor requests raw materials with automated AI safety check
 * @route   POST /api/v1/contractor/materials/request
 * @access  Private (Contractor only)
 */
const createMaterialRequest = asyncHandler(async (req, res) => {
  const { projectId, materialType, quantity, unit } = req.body;
  const contractorId = req.user._id;

  // 1. Verify project assignment
  const project = await Project.findOne({
    _id: projectId,
    contractorId
  });

  if (!project) {
    throw ApiError.notFound(
      'Project not found or you are not authorized as the assigned contractor for this project'
    );
  }

  // 2. Run AI consumption & anomaly evaluation
  const aiCheck = evaluateMaterialRequest({
    project,
    materialType,
    quantity: Number(quantity),
    unit: unit || 'units'
  });

  // 3. Create requisition record
  const materialRequest = await MaterialRequest.create({
    projectId,
    materialType,
    quantity: Number(quantity),
    unit: unit || 'units',
    aiStatus: aiCheck.aiStatus,
    aiReason: aiCheck.aiReason,
    status: 'Pending',
    requestedBy: contractorId
  });

  return ApiResponse.created(
    res,
    {
      materialRequest
    },
    'Material request submitted and audited by AI successfully'
  );
});

/**
 * FEATURE 5: View Previous Uploads
 * @desc    Contractor views all their past material delivery and progress uploads
 * @route   GET /api/v1/contractor/uploads
 * @access  Private (Contractor only)
 */
const getPreviousUploads = asyncHandler(async (req, res) => {
  const contractorId = req.user._id;
  const { projectId, type } = req.query;

  // Filter criteria
  const filter = { uploadedBy: contractorId };
  if (projectId) {
    filter.projectId = projectId;
  }

  let materialDeliveries = [];
  let progressUpdates = [];

  // Fetch materials if not filtered exclusively for progress
  if (!type || type === 'materials') {
    materialDeliveries = await MaterialUpload.find(filter)
      .populate('projectId', 'projectName location currentStage')
      .sort({ uploadDate: -1 });
  }

  // Fetch progress if not filtered exclusively for materials
  if (!type || type === 'progress') {
    progressUpdates = await ProgressUpdate.find(filter)
      .populate('projectId', 'projectName location currentStage')
      .sort({ uploadDate: -1 });
  }

  return ApiResponse.ok(
    res,
    {
      totalUploads: materialDeliveries.length + progressUpdates.length,
      materialDeliveriesCount: materialDeliveries.length,
      progressUpdatesCount: progressUpdates.length,
      materialDeliveries,
      progressUpdates
    },
    'Previous contractor uploads retrieved successfully'
  );
});

module.exports = {
  getAssignedProjects,
  uploadMaterialDelivery,
  uploadConstructionProgress,
  createMaterialRequest,
  getPreviousUploads
};
