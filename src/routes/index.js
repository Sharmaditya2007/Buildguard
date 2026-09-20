const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const contractorRoutes = require('./contractorRoutes');
const homeownerRoutes = require('./homeownerRoutes');
const projectRoutes = require('./projectRoutes');
const aiRoutes = require('./aiRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BuildGuard AI Backend API is online and healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/contractor', contractorRoutes);
router.use('/homeowner', homeownerRoutes);
router.use('/projects', projectRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
