const Project = require('../models/Project');
const MaterialRequest = require('../models/MaterialRequest');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Create a new project (Homeowner assigns contractor)
 * @route   POST /api/v1/projects
 * @access  Private (Homeowner)
 */
const createProject = asyncHandler(async (req, res) => {
  const { projectName, areaSqft, budget, location, contractorId, startDate } = req.body;
  const homeownerId = req.user._id;

  // Validate contractor exists and has role 'contractor'
  const contractor = await User.findOne({ _id: contractorId, role: 'contractor' });
  if (!contractor) {
    throw ApiError.badRequest('Invalid contractorId: user does not exist or is not a contractor');
  }

  const project = await Project.create({
    projectName,
    areaSqft: Number(areaSqft),
    budget: Number(budget),
    location,
    startDate: startDate || Date.now(),
    currentStage: 'Planning',
    homeownerId,
    contractorId
  });

  return ApiResponse.created(res, { project }, 'Project created successfully');
});

/**
 * @desc    Get project details by ID
 * @route   GET /api/v1/projects/:id
 * @access  Private (Homeowner or Assigned Contractor)
 */
const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id)
    .populate('homeownerId', 'name email')
    .populate('contractorId', 'name email');

  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  // Authorize: Only assigned homeowner or contractor can access
  const isHomeowner = project.homeownerId._id.toString() === req.user._id.toString();
  const isContractor = project.contractorId._id.toString() === req.user._id.toString();

  if (!isHomeowner && !isContractor) {
    throw ApiError.forbidden('You are not authorized to view this project');
  }

  return ApiResponse.ok(res, { project }, 'Project details retrieved successfully');
});

/**
 * @desc    Homeowner updates material request status (Approve / Reject)
 * @route   PATCH /api/v1/projects/material-requests/:id/status
 * @access  Private (Homeowner)
 */
const updateMaterialRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    throw ApiError.badRequest('Status must be either Approved or Rejected');
  }

  const materialRequest = await MaterialRequest.findById(id).populate('projectId');
  if (!materialRequest) {
    throw ApiError.notFound('Material request not found');
  }

  // Ensure logged-in user is the homeowner of this project
  if (materialRequest.projectId.homeownerId.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('Only the project homeowner can approve or reject material requests');
  }

  materialRequest.status = status;
  await materialRequest.save();

  return ApiResponse.ok(res, { materialRequest }, `Material request ${status.toLowerCase()} successfully`);
});

module.exports = {
  createProject,
  getProjectById,
  updateMaterialRequestStatus
};
