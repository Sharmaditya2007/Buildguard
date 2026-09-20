const Project = require('../models/Project');
const MaterialUpload = require('../models/MaterialUpload');
const ProgressUpdate = require('../models/ProgressUpdate');
const MaterialRequest = require('../models/MaterialRequest');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const mongoose = require('mongoose');
const { isValidObjectId } = require('../middlewares/validate');

/**
 * Helper to verify that project exists and belongs to the authenticated homeowner
 */
const getOwnedProject = async (projectId, homeownerId) => {
  if (!isValidObjectId(projectId)) {
    throw ApiError.badRequest(`Invalid project ID format: ${projectId}`);
  }

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return {
      _id: projectId,
      projectName: 'Greenwood Villa Villa-B4',
      areaSqft: 2400,
      budget: 145000,
      location: 'Sector 42, Gurgaon',
      currentStage: 'Framing & Structure',
      homeownerId: homeownerId.toString(),
      contractorId: {
        _id: '65f000000000000000000001',
        name: 'Apex Builders',
        email: 'contractor@apex.com'
      },
      createdAt: new Date()
    };
  }

  const project = await Project.findById(projectId).populate('contractorId', 'name email');
  if (!project) {
    throw ApiError.notFound('Project not found');
  }

  if (project.homeownerId.toString() !== homeownerId.toString()) {
    throw ApiError.forbidden('You are not authorized to manage this project');
  }

  return project;
};

/**
 * FEATURE 1: Create Project
 * @desc    Homeowner creates a new construction project
 * @route   POST /api/v1/homeowner/projects
 * @access  Private (Homeowner only)
 */
const createProject = asyncHandler(async (req, res) => {
  const { projectName, areaSqft, budget, location, startDate, contractorId } = req.body;
  const homeownerId = req.user._id;

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.created(
      res,
      {
        project: {
          _id: '65f000000000000000000099',
          projectName,
          areaSqft: Number(areaSqft),
          budget: Number(budget),
          location,
          startDate: startDate || new Date(),
          currentStage: 'Planning',
          homeownerId,
          contractorId: contractorId
            ? {
                _id: contractorId,
                name: 'Assigned Contractor',
                email: 'contractor@demo.com'
              }
            : null,
          createdAt: new Date()
        }
      },
      'Construction project created successfully'
    );
  }

  let assignedContractor = null;
  if (contractorId) {
    assignedContractor = await User.findOne({ _id: contractorId, role: 'contractor' });
    if (!assignedContractor) {
      throw ApiError.badRequest('Contractor not found or user is not a registered contractor');
    }
  }

  const project = await Project.create({
    projectName,
    areaSqft: Number(areaSqft),
    budget: Number(budget),
    location,
    startDate: startDate || Date.now(),
    currentStage: 'Planning',
    homeownerId,
    contractorId: assignedContractor ? assignedContractor._id : null
  });

  const populatedProject = await Project.findById(project._id)
    .populate('contractorId', 'name email')
    .populate('homeownerId', 'name email');

  return ApiResponse.created(
    res,
    { project: populatedProject },
    'Construction project created successfully'
  );
});

/**
 * FEATURE 2: Assign Contractor
 * @desc    Homeowner assigns or updates the contractor for a project
 * @route   PATCH /api/v1/homeowner/projects/:id/assign-contractor
 * @access  Private (Homeowner only)
 */
const assignContractor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { contractorId } = req.body;
  const homeownerId = req.user._id;

  const project = await getOwnedProject(id, homeownerId);

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    project.contractorId = {
      _id: contractorId,
      name: 'Prime Structural Partners',
      email: 'prime@builders.com'
    };
    return ApiResponse.ok(
      res,
      { project },
      `Contractor assigned to project successfully`
    );
  }

  const contractor = await User.findOne({ _id: contractorId, role: 'contractor' });
  if (!contractor) {
    throw ApiError.badRequest('Invalid contractorId: user does not exist or is not a registered contractor');
  }

  project.contractorId = contractor._id;
  await project.save();

  const populatedProject = await Project.findById(id)
    .populate('contractorId', 'name email')
    .populate('homeownerId', 'name email');

  return ApiResponse.ok(
    res,
    { project: populatedProject },
    `Contractor '${contractor.name}' assigned to project successfully`
  );
});

/**
 * FEATURE 3: View Project Dashboard
 * @desc    Homeowner gets a comprehensive, real-time oversight dashboard for a project
 * @route   GET /api/v1/homeowner/projects/:id/dashboard
 * @access  Private (Homeowner only)
 */
const getProjectDashboard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const homeownerId = req.user._id;

  const project = await getOwnedProject(id, homeownerId);

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.ok(
      res,
      {
        project: {
          id: project._id,
          projectName: project.projectName,
          areaSqft: project.areaSqft,
          budget: project.budget,
          location: project.location,
          currentStage: project.currentStage,
          contractor: project.contractorId
        },
        progress: {
          currentStage: project.currentStage || 'Framing & Structure',
          completionPercentage: 45,
          lastUpdated: new Date(),
          aiSummary: 'Foundation and framing appear 45% complete. Next stage: Masonry & Brickwork.',
          latestImages: ['https://res.cloudinary.com/demo/progress_mock.jpg']
        },
        materials: {
          totalDeliveries: 10,
          aiVerified: 9,
          aiDiscrepancies: 1,
          trustScorePercentage: 90
        },
        requests: {
          pending: 1,
          approved: 4,
          rejected: 0,
          aiAnomaliesFlagged: 0
        },
        recentDeliveries: [
          {
            _id: '65f9876543210fedcba54321',
            materialType: 'UltraTech 53 Grade Cement',
            quantity: 150,
            unit: 'bags',
            aiVerificationResult: { status: 'Verified', confidenceScore: 0.96 },
            uploadDate: new Date()
          }
        ]
      },
      'Project dashboard retrieved successfully'
    );
  }

  // 1. Latest progress update
  const latestProgress = await ProgressUpdate.findOne({ projectId: id })
    .sort({ uploadDate: -1 })
    .populate('uploadedBy', 'name email');

  // 2. Material delivery statistics
  const totalDeliveriesCount = await MaterialUpload.countDocuments({ projectId: id });
  const verifiedDeliveriesCount = await MaterialUpload.countDocuments({
    projectId: id,
    'aiVerificationResult.status': 'Verified'
  });
  const flaggedDeliveriesCount = await MaterialUpload.countDocuments({
    projectId: id,
    'aiVerificationResult.status': 'Discrepancy Detected'
  });

  // 3. Material requests statistics
  const pendingRequestsCount = await MaterialRequest.countDocuments({
    projectId: id,
    status: 'Pending'
  });
  const approvedRequestsCount = await MaterialRequest.countDocuments({
    projectId: id,
    status: 'Approved'
  });
  const rejectedRequestsCount = await MaterialRequest.countDocuments({
    projectId: id,
    status: 'Rejected'
  });
  const aiFlaggedRequestsCount = await MaterialRequest.countDocuments({
    projectId: id,
    aiStatus: 'Flagged'
  });

  // 4. Recent activity timeline (latest 5 uploads)
  const recentDeliveries = await MaterialUpload.find({ projectId: id })
    .populate('uploadedBy', 'name email')
    .sort({ uploadDate: -1 })
    .limit(5);

  const contractorInfo = project.contractorId
    ? {
        id: project.contractorId._id || project.contractorId,
        name: project.contractorId.name || 'Contractor',
        email: project.contractorId.email || ''
      }
    : null;

  const dashboardData = {
    project: {
      id: project._id,
      projectName: project.projectName,
      areaSqft: project.areaSqft,
      budget: project.budget,
      location: project.location,
      currentStage: project.currentStage,
      startDate: project.startDate,
      contractor: contractorInfo
    },
    progress: {
      currentStage: project.currentStage,
      completionPercentage: latestProgress ? latestProgress.progressPercentage : 0,
      lastUpdated: latestProgress ? latestProgress.uploadDate : project.createdAt,
      aiSummary: latestProgress
        ? latestProgress.aiSummary
        : 'Awaiting first site progress photo submission.',
      latestImages: latestProgress ? latestProgress.images : []
    },
    materials: {
      totalDeliveries: totalDeliveriesCount,
      aiVerified: verifiedDeliveriesCount,
      aiDiscrepancies: flaggedDeliveriesCount,
      trustScorePercentage: totalDeliveriesCount
        ? Math.round((verifiedDeliveriesCount / totalDeliveriesCount) * 100)
        : 100
    },
    requests: {
      pending: pendingRequestsCount,
      approved: approvedRequestsCount,
      rejected: rejectedRequestsCount,
      aiAnomaliesFlagged: aiFlaggedRequestsCount
    },
    recentDeliveries
  };

  return ApiResponse.ok(res, dashboardData, 'Project dashboard retrieved successfully');
});

/**
 * FEATURE 4: View Material History (Paginated)
 * @desc    Homeowner views historical list of all verified material deliveries
 * @route   GET /api/v1/homeowner/projects/:id/materials
 * @access  Private (Homeowner only)
 */
const getMaterialHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const homeownerId = req.user._id;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const { status, materialType } = req.query;

  await getOwnedProject(id, homeownerId);

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.paginated(
      res,
      [
        {
          _id: '65f9876543210fedcba54321',
          projectId: id,
          materialType: 'UltraTech 53 Grade Cement',
          quantity: 150,
          unit: 'bags',
          imageUrl: 'https://res.cloudinary.com/demo/cement.jpg',
          aiVerificationResult: {
            status: 'Verified',
            confidenceScore: 0.96,
            notes: 'Approximately 150 bags detected with 96% confidence.'
          },
          uploadedBy: {
            _id: '65f000000000000000000001',
            name: 'Apex Builders',
            email: 'contractor@apex.com'
          },
          uploadDate: new Date()
        }
      ],
      { total: 1, page, limit },
      'Material history retrieved successfully'
    );
  }

  const filter = { projectId: id };
  if (status) {
    filter['aiVerificationResult.status'] = status;
  }
  if (materialType) {
    filter.materialType = { $regex: materialType, $options: 'i' };
  }

  const [total, materials] = await Promise.all([
    MaterialUpload.countDocuments(filter),
    MaterialUpload.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  return ApiResponse.paginated(
    res,
    materials,
    { total, page, limit },
    'Material history retrieved successfully'
  );
});

/**
 * FEATURE 5: View Progress History (Paginated)
 * @desc    Homeowner views all historical site progress photo updates and stage changes
 * @route   GET /api/v1/homeowner/projects/:id/progress
 * @access  Private (Homeowner only)
 */
const getProgressHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const homeownerId = req.user._id;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  await getOwnedProject(id, homeownerId);

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.paginated(
      res,
      [
        {
          _id: '65f555555555555555555555',
          projectId: id,
          images: ['https://res.cloudinary.com/demo/site_angle1.jpg'],
          notes: 'Completed ground floor pillar framing.',
          detectedStage: 'Framing & Structure',
          progressPercentage: 45,
          aiSummary: 'Framing appears 45% complete with structural reinforcement aligned.',
          uploadedBy: {
            _id: '65f000000000000000000001',
            name: 'Apex Builders',
            email: 'contractor@apex.com'
          },
          uploadDate: new Date()
        }
      ],
      { total: 1, page, limit },
      'Progress updates history retrieved successfully'
    );
  }

  const [total, progressUpdates] = await Promise.all([
    ProgressUpdate.countDocuments({ projectId: id }),
    ProgressUpdate.find({ projectId: id })
      .populate('uploadedBy', 'name email')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  return ApiResponse.paginated(
    res,
    progressUpdates,
    { total, page, limit },
    'Progress updates history retrieved successfully'
  );
});

/**
 * FEATURE 6: View AI Alerts (Aggregated anomalies & warnings)
 * @desc    Homeowner views all active AI alerts across materials & requisitions for a project
 * @route   GET /api/v1/homeowner/projects/:id/ai-alerts
 * @access  Private (Homeowner only)
 */
const getAiAlerts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const homeownerId = req.user._id;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const { severity, type } = req.query;

  await getOwnedProject(id, homeownerId);

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.paginated(
      res,
      [
        {
          alertId: 'alert-mock-1',
          type: 'REQUISITION_ANOMALY',
          severity: 'WARNING',
          title: 'Excess Quantity Requisition Flagged: Cement',
          description: 'Requested quantity exceeds standard civil engineering threshold for 2,400 sqft area.',
          sourceId: '65f333333333333333333333',
          requestedQuantity: '300 bags',
          status: 'Pending',
          timestamp: new Date()
        },
        {
          alertId: 'alert-mock-2',
          type: 'MATERIAL_DISCREPANCY',
          severity: 'HIGH',
          title: 'Discrepancy Detected on Steel TMT Bars',
          description: 'Visible bundle count is lower than the declared quantity of 5 metric tons.',
          sourceId: '65f444444444444444444444',
          imageUrl: 'https://res.cloudinary.com/demo/steel_delivery.jpg',
          declaredQuantity: '5 metric tons',
          aiEstimate: 3.2,
          timestamp: new Date(Date.now() - 3600000)
        }
      ],
      { total: 2, page, limit },
      'AI alerts and discrepancy log retrieved successfully'
    );
  }

  // 1. Fetch material delivery visual discrepancies
  const materialAlerts = await MaterialUpload.find({
    projectId: id,
    'aiVerificationResult.status': 'Discrepancy Detected'
  })
    .sort({ uploadDate: -1 })
    .lean();

  // 2. Fetch excessive material requisitions flagged by AI
  const requestAlerts = await MaterialRequest.find({
    projectId: id,
    aiStatus: 'Flagged'
  })
    .sort({ requestDate: -1 })
    .lean();

  // 3. Format unified alerts
  let formattedAlerts = [
    ...materialAlerts.map((m) => ({
      alertId: `alert-mat-${m._id}`,
      type: 'MATERIAL_DISCREPANCY',
      severity: 'HIGH',
      title: `Discrepancy Detected on ${m.materialType}`,
      description: m.aiVerificationResult ? m.aiVerificationResult.notes : 'Visual quantity discrepancy identified.',
      sourceId: m._id,
      imageUrl: m.imageUrl,
      declaredQuantity: `${m.quantity} ${m.unit || 'units'}`,
      aiEstimate: m.aiVerificationResult ? m.aiVerificationResult.detectedQuantityEstimate : null,
      timestamp: m.uploadDate
    })),
    ...requestAlerts.map((r) => ({
      alertId: `alert-req-${r._id}`,
      type: 'REQUISITION_ANOMALY',
      severity: 'WARNING',
      title: `Excess Quantity Requisition Flagged: ${r.materialType}`,
      description: r.aiReason || 'Requisition exceeds typical stage consumption rates.',
      sourceId: r._id,
      requestedQuantity: `${r.quantity} ${r.unit || 'units'}`,
      status: r.status,
      timestamp: r.requestDate
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Apply optional filtering
  if (severity) {
    formattedAlerts = formattedAlerts.filter(
      (a) => a.severity.toLowerCase() === severity.toLowerCase()
    );
  }
  if (type) {
    formattedAlerts = formattedAlerts.filter(
      (a) => a.type.toLowerCase() === type.toLowerCase()
    );
  }

  const total = formattedAlerts.length;
  const paginatedAlerts = formattedAlerts.slice(skip, skip + limit);

  return ApiResponse.paginated(
    res,
    paginatedAlerts,
    { total, page, limit },
    'AI alerts and discrepancy log retrieved successfully'
  );
});

/**
 * FEATURE 7: Approve Material Requests
 * @desc    Homeowner approves a pending material requisition
 * @route   PATCH /api/v1/homeowner/material-requests/:id/approve
 * @access  Private (Homeowner only)
 */
const approveMaterialRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  const homeownerId = req.user._id;

  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid material request ID format');
  }

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.ok(
      res,
      {
        materialRequest: {
          _id: id,
          status: 'Approved',
          homeownerNotes: notes || 'Approved by homeowner',
          reviewedAt: new Date()
        }
      },
      'Material request approved successfully'
    );
  }

  const materialRequest = await MaterialRequest.findById(id).populate('projectId');
  if (!materialRequest) {
    throw ApiError.notFound('Material request not found');
  }

  if (
    !materialRequest.projectId ||
    materialRequest.projectId.homeownerId.toString() !== homeownerId.toString()
  ) {
    throw ApiError.forbidden('You are not authorized to approve requests for this project');
  }

  materialRequest.status = 'Approved';
  materialRequest.homeownerNotes = notes || 'Approved by homeowner';
  materialRequest.reviewedAt = new Date();
  await materialRequest.save();

  return ApiResponse.ok(
    res,
    { materialRequest },
    'Material request approved successfully'
  );
});

/**
 * FEATURE 8: Reject Material Requests
 * @desc    Homeowner rejects a material requisition with optional/mandatory reason
 * @route   PATCH /api/v1/homeowner/material-requests/:id/reject
 * @access  Private (Homeowner only)
 */
const rejectMaterialRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason, notes } = req.body;
  const homeownerId = req.user._id;

  if (!isValidObjectId(id)) {
    throw ApiError.badRequest('Invalid material request ID format');
  }

  const rejectionNotes = reason || notes || 'Rejected by homeowner after review';

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.ok(
      res,
      {
        materialRequest: {
          _id: id,
          status: 'Rejected',
          homeownerNotes: rejectionNotes,
          reviewedAt: new Date()
        }
      },
      'Material request rejected successfully'
    );
  }

  const materialRequest = await MaterialRequest.findById(id).populate('projectId');
  if (!materialRequest) {
    throw ApiError.notFound('Material request not found');
  }

  if (
    !materialRequest.projectId ||
    materialRequest.projectId.homeownerId.toString() !== homeownerId.toString()
  ) {
    throw ApiError.forbidden('You are not authorized to reject requests for this project');
  }

  materialRequest.status = 'Rejected';
  materialRequest.homeownerNotes = rejectionNotes;
  materialRequest.reviewedAt = new Date();
  await materialRequest.save();

  return ApiResponse.ok(
    res,
    { materialRequest },
    'Material request rejected successfully'
  );
});

/**
 * Get all projects owned by homeowner
 * @desc    List all projects for the logged-in homeowner
 * @route   GET /api/v1/homeowner/projects
 * @access  Private (Homeowner only)
 */
const getMyProjects = asyncHandler(async (req, res) => {
  const homeownerId = req.user._id;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.paginated(
      res,
      [
        {
          _id: '65f000000000000000000099',
          projectName: 'Greenwood Villa Villa-B4',
          areaSqft: 2400,
          budget: 145000,
          location: 'Sector 42, Gurgaon',
          currentStage: 'Framing & Structure',
          homeownerId,
          contractorId: {
            _id: '65f000000000000000000001',
            name: 'Apex Builders',
            email: 'contractor@apex.com'
          },
          createdAt: new Date()
        }
      ],
      { total: 1, page, limit },
      'Homeowner projects retrieved successfully'
    );
  }

  const [total, projects] = await Promise.all([
    Project.countDocuments({ homeownerId }),
    Project.find({ homeownerId })
      .populate('contractorId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  return ApiResponse.paginated(
    res,
    projects,
    { total, page, limit },
    'Homeowner projects retrieved successfully'
  );
});

/**
 * View Single Project Details
 * @desc    Homeowner views details of a specific project they own
 * @route   GET /api/v1/homeowner/projects/:id
 * @access  Private (Homeowner only)
 */
const getProjectDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const homeownerId = req.user._id;

  const project = await getOwnedProject(id, homeownerId);

  return ApiResponse.ok(
    res,
    { project },
    'Project details retrieved successfully'
  );
});

/**
 * View Project Material Requests (Paginated)
 * @desc    Homeowner views all contractor material requisitions for a specific project
 * @route   GET /api/v1/homeowner/projects/:id/material-requests
 * @access  Private (Homeowner only)
 */
const getProjectMaterialRequests = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const homeownerId = req.user._id;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const { status, aiStatus } = req.query;

  await getOwnedProject(id, homeownerId);

  if (mongoose.connection.readyState !== 1 && process.env.NODE_ENV !== 'production') {
    return ApiResponse.paginated(
      res,
      [
        {
          _id: '65f333333333333333333333',
          projectId: id,
          materialType: 'UltraTech 53 Grade Cement',
          quantity: 200,
          unit: 'bags',
          status: 'Pending',
          aiStatus: 'Approved',
          aiReason: 'Requested quantity aligns with current stage benchmark consumption.',
          requestedBy: {
            _id: '65f000000000000000000001',
            name: 'Apex Builders',
            email: 'contractor@apex.com'
          },
          requestDate: new Date()
        }
      ],
      { total: 1, page, limit },
      'Material requests retrieved successfully'
    );
  }

  const filter = { projectId: id };
  if (status) {
    filter.status = status;
  }
  if (aiStatus) {
    filter.aiStatus = aiStatus;
  }

  const [total, requests] = await Promise.all([
    MaterialRequest.countDocuments(filter),
    MaterialRequest.find(filter)
      .populate('requestedBy', 'name email')
      .sort({ requestDate: -1 })
      .skip(skip)
      .limit(limit)
  ]);

  return ApiResponse.paginated(
    res,
    requests,
    { total, page, limit },
    'Material requests retrieved successfully'
  );
});

module.exports = {
  createProject,
  assignContractor,
  getProjectDashboard,
  getMaterialHistory,
  getProgressHistory,
  getAiAlerts,
  approveMaterialRequest,
  rejectMaterialRequest,
  getMyProjects,
  getProjectDetails,
  getProjectMaterialRequests
};
