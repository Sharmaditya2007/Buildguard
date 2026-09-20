const express = require('express');
const router = express.Router();
const {
  verifyMaterialEndpoint,
  analyzeProgressEndpoint,
  analyzeMaterialRequestEndpoint
} = require('../controllers/aiController');

/**
 * @route   POST /api/v1/ai/verify-material
 * @desc    1. Material Verification via AI
 */
router.post('/verify-material', verifyMaterialEndpoint);

/**
 * @route   POST /api/v1/ai/analyze-progress
 * @desc    2. Progress Analysis via AI
 */
router.post('/analyze-progress', analyzeProgressEndpoint);

/**
 * @route   POST /api/v1/ai/analyze-material-request
 * @desc    3. Material Request Analysis via AI
 */
router.post('/analyze-material-request', analyzeMaterialRequestEndpoint);

module.exports = router;
