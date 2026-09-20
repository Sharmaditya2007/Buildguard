const {
  verifyMaterial,
  analyzeProgress,
  analyzeMaterialRequest
} = require('../services/aiService');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    1. Verify delivered materials via image analysis
 * @route   POST /api/v1/ai/verify-material
 * @access  Public / Authenticated
 */
const verifyMaterialEndpoint = asyncHandler(async (req, res) => {
  const { image, imageUrl, materialType, declaredQuantity } = req.body;

  const targetImage = image || imageUrl;
  if (!targetImage) {
    throw ApiError.badRequest('Material image (URL or base64) is required');
  }
  if (!materialType || String(materialType).trim().length === 0) {
    throw ApiError.badRequest('materialType is required');
  }

  const result = await verifyMaterial({
    image: targetImage,
    materialType,
    declaredQuantity
  });

  return ApiResponse.ok(res, result, 'Material verified successfully');
});

/**
 * @desc    2. Analyze construction progress from site photos
 * @route   POST /api/v1/ai/analyze-progress
 * @access  Public / Authenticated
 */
const analyzeProgressEndpoint = asyncHandler(async (req, res) => {
  const { photos, images, currentStage } = req.body;

  const targetPhotos = photos || images;
  if (!targetPhotos || (Array.isArray(targetPhotos) && targetPhotos.length === 0)) {
    throw ApiError.badRequest('At least one site progress photo is required');
  }

  const result = await analyzeProgress({
    photos: targetPhotos,
    currentStage: currentStage || 'Foundation'
  });

  return ApiResponse.ok(res, result, 'Progress analyzed successfully');
});

/**
 * @desc    3. Analyze contractor material request with neutral reasoning
 * @route   POST /api/v1/ai/analyze-material-request
 * @access  Public / Authenticated
 */
const analyzeMaterialRequestEndpoint = asyncHandler(async (req, res) => {
  const { houseSize, currentStage, previousDeliveries, requestedQuantity, materialType } = req.body;

  if (houseSize === undefined || isNaN(Number(houseSize)) || Number(houseSize) <= 0) {
    throw ApiError.badRequest('houseSize must be a positive number');
  }
  if (requestedQuantity === undefined || isNaN(Number(requestedQuantity)) || Number(requestedQuantity) <= 0) {
    throw ApiError.badRequest('requestedQuantity must be a positive number');
  }

  const result = await analyzeMaterialRequest({
    houseSize: Number(houseSize),
    currentStage: currentStage || 'Foundation',
    previousDeliveries: Number(previousDeliveries) || 0,
    requestedQuantity: Number(requestedQuantity),
    materialType: materialType || 'Cement'
  });

  return ApiResponse.ok(res, result, 'Material request evaluated successfully');
});

module.exports = {
  verifyMaterialEndpoint,
  analyzeProgressEndpoint,
  analyzeMaterialRequestEndpoint
};
