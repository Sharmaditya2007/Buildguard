const mongoose = require('mongoose');

const materialUploadSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required']
    },
    materialType: {
      type: String,
      required: [true, 'Material type is required'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be greater than 0']
    },
    unit: {
      type: String,
      default: 'units',
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Material image URL is required']
    },
    cloudinaryPublicId: {
      type: String,
      default: null
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    aiVerificationResult: {
      status: {
        type: String,
        enum: ['Verified', 'Discrepancy Detected', 'Pending Inspection'],
        default: 'Verified'
      },
      confidenceScore: {
        type: Number,
        default: 0.95
      },
      detectedMaterial: {
        type: String,
        default: null
      },
      detectedQuantityEstimate: {
        type: Number,
        default: null
      },
      notes: {
        type: String,
        default: 'Automated AI visual check completed.'
      },
      verifiedAt: {
        type: Date,
        default: Date.now
      }
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader user ID is required']
    }
  },
  {
    timestamps: true
  }
);

materialUploadSchema.index({ projectId: 1, uploadDate: -1 });

const MaterialUpload = mongoose.model('MaterialUpload', materialUploadSchema);
module.exports = MaterialUpload;
