const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjectById,
  updateMaterialRequestStatus
} = require('../controllers/projectController');
const { protect, homeownerOnly } = require('../middlewares/auth');

router.use(protect);

// Homeowner creates project
router.post('/', homeownerOnly, createProject);

// View project (Contractor or Homeowner assigned to the project)
router.get('/:id', getProjectById);

// Homeowner approves/rejects material requests
router.patch('/material-requests/:id/status', homeownerOnly, updateMaterialRequestStatus);

module.exports = router;
