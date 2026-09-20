const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/homeownerController');
const { protect, homeownerOnly } = require('../middlewares/auth');
const {
  validateCreateProject,
  validateAssignContractor,
  validateRejectMaterialRequest
} = require('../middlewares/validate');

// Protect all routes: Require JWT and Homeowner role
router.use(protect);
router.use(homeownerOnly);

/**
 * @route   POST /api/v1/homeowner/projects
 * @desc    Feature 1: Create a new construction project
 * @access  Private (Homeowner only)
 */
router.post('/projects', validateCreateProject, createProject);

/**
 * @route   GET /api/v1/homeowner/projects
 * @desc    List all projects for the authenticated homeowner (Paginated)
 * @access  Private (Homeowner only)
 */
router.get('/projects', getMyProjects);

/**
 * @route   GET /api/v1/homeowner/projects/:id
 * @desc    View single project details
 * @access  Private (Homeowner only)
 */
router.get('/projects/:id', getProjectDetails);

/**
 * @route   PATCH /api/v1/homeowner/projects/:id/assign-contractor
 * @desc    Feature 2: Assign or update contractor for project
 * @access  Private (Homeowner only)
 */
router.patch('/projects/:id/assign-contractor', validateAssignContractor, assignContractor);

/**
 * @route   GET /api/v1/homeowner/projects/:id/dashboard
 * @desc    Feature 3: View comprehensive real-time project dashboard
 * @access  Private (Homeowner only)
 */
router.get('/projects/:id/dashboard', getProjectDashboard);

/**
 * @route   GET /api/v1/homeowner/projects/:id/materials
 * @desc    Feature 4: View material delivery history (Paginated)
 * @access  Private (Homeowner only)
 */
router.get('/projects/:id/materials', getMaterialHistory);

/**
 * @route   GET /api/v1/homeowner/projects/:id/progress
 * @desc    Feature 5: View site progress photo history (Paginated)
 * @access  Private (Homeowner only)
 */
router.get('/projects/:id/progress', getProgressHistory);

/**
 * @route   GET /api/v1/homeowner/projects/:id/ai-alerts
 * @desc    Feature 6: View AI alerts and discrepancy warnings (Paginated)
 * @access  Private (Homeowner only)
 */
router.get('/projects/:id/ai-alerts', getAiAlerts);

/**
 * @route   GET /api/v1/homeowner/projects/:id/material-requests
 * @desc    View all contractor material requisitions for a project (Paginated)
 * @access  Private (Homeowner only)
 */
router.get('/projects/:id/material-requests', getProjectMaterialRequests);

/**
 * @route   PATCH /api/v1/homeowner/material-requests/:id/approve
 * @desc    Feature 7: Approve contractor material request
 * @access  Private (Homeowner only)
 */
router.patch('/material-requests/:id/approve', approveMaterialRequest);

/**
 * @route   PATCH /api/v1/homeowner/material-requests/:id/reject
 * @desc    Feature 8: Reject contractor material request with reasons
 * @access  Private (Homeowner only)
 */
router.patch('/material-requests/:id/reject', validateRejectMaterialRequest, rejectMaterialRequest);

module.exports = router;
