const mongoose = require('mongoose');
const ApiError = require('../utils/apiError');

/**
 * Validates whether an ID is a valid MongoDB ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Middleware to validate registration body
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];

  if (!name || name.trim().length === 0) errors.push('Name is required');
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))
    errors.push('A valid email address is required');
  if (!password || password.length < 6)
    errors.push('Password must be at least 6 characters long');
  if (!role || !['homeowner', 'contractor'].includes(role))
    errors.push('Role must be either homeowner or contractor');

  if (errors.length > 0) {
    return next(ApiError.badRequest('Registration validation failed', errors));
  }
  next();
};

/**
 * Middleware to validate login body
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');

  if (errors.length > 0) {
    return next(ApiError.badRequest('Login validation failed', errors));
  }
  next();
};

/**
 * Middleware to validate material delivery upload
 */
const validateMaterialDelivery = (req, res, next) => {
  const { projectId, materialType, quantity } = req.body;
  const errors = [];

  if (!projectId || !isValidObjectId(projectId)) {
    errors.push('A valid projectId is required');
  }
  if (!materialType || materialType.trim().length === 0) {
    errors.push('materialType is required');
  }
  if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
    errors.push('A valid quantity greater than 0 is required');
  }
  if (!req.file) {
    errors.push('Material image file is required');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Material delivery validation failed', errors));
  }
  next();
};

/**
 * Middleware to validate construction progress upload
 */
const validateProgressUpload = (req, res, next) => {
  const { projectId } = req.body;
  const errors = [];

  if (!projectId || !isValidObjectId(projectId)) {
    errors.push('A valid projectId is required');
  }
  if (!req.files || req.files.length === 0) {
    errors.push('At least one site progress photo is required');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Progress upload validation failed', errors));
  }
  next();
};

/**
 * Middleware to validate material requisition
 */
const validateMaterialRequest = (req, res, next) => {
  const { projectId, materialType, quantity } = req.body;
  const errors = [];

  if (!projectId || !isValidObjectId(projectId)) {
    errors.push('A valid projectId is required');
  }
  if (!materialType || materialType.trim().length === 0) {
    errors.push('materialType is required');
  }
  if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
    errors.push('A valid quantity greater than 0 is required');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Material request validation failed', errors));
  }
  next();
};

/**
 * Middleware to validate project creation
 */
const validateCreateProject = (req, res, next) => {
  const { projectName, areaSqft, budget, location, contractorId } = req.body;
  const errors = [];

  if (!projectName || projectName.trim().length === 0) {
    errors.push('projectName is required');
  }
  if (!areaSqft || isNaN(Number(areaSqft)) || Number(areaSqft) <= 0) {
    errors.push('areaSqft must be a positive number');
  }
  if (budget === undefined || isNaN(Number(budget)) || Number(budget) < 0) {
    errors.push('budget must be a valid positive number');
  }
  if (!location || location.trim().length === 0) {
    errors.push('location is required');
  }
  if (contractorId && !isValidObjectId(contractorId)) {
    errors.push('contractorId must be a valid ObjectId');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Project creation validation failed', errors));
  }
  next();
};

/**
 * Middleware to validate contractor assignment
 */
const validateAssignContractor = (req, res, next) => {
  const { contractorId } = req.body;
  const errors = [];

  if (!contractorId || !isValidObjectId(contractorId)) {
    errors.push('A valid contractorId is required');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Contractor assignment validation failed', errors));
  }
  next();
};

/**
 * Middleware to validate material request rejection
 */
const validateRejectMaterialRequest = (req, res, next) => {
  const { reason } = req.body;
  const errors = [];

  if (reason !== undefined && typeof reason !== 'string') {
    errors.push('Rejection reason must be a text string');
  }

  if (errors.length > 0) {
    return next(ApiError.badRequest('Reject material request validation failed', errors));
  }
  next();
};

module.exports = {
  isValidObjectId,
  validateRegister,
  validateLogin,
  validateMaterialDelivery,
  validateProgressUpload,
  validateMaterialRequest,
  validateCreateProject,
  validateAssignContractor,
  validateRejectMaterialRequest
};


