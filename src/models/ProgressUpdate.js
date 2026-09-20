const mongoose = require('mongoose');

const progressUpdateSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required']
    },
    images: {
      type: [String],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'At least one progress image is required'
      }
    },
    cloudinaryPublicIds: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    detectedStage: {
      type: String,
      default: 'Foundation'
    },
    progressPercentage: {
      type: Number,
      required: [true, 'Progress percentage is required'],
      min: [0, 'Progress percentage cannot be negative'],
      max: [100, 'Progress percentage cannot exceed 100'],
      default: 0
    },
    aiSummary: {
      type: String,
      default: 'AI visual analysis: site progress evaluated successfully.'
    },
    uploadDate: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Contractor ID is required']
    }
  },
  {
    timestamps: true
  }
);

progressUpdateSchema.index({ projectId: 1, uploadDate: -1 });

const ProgressUpdate = mongoose.model('ProgressUpdate', progressUpdateSchema);
module.exports = ProgressUpdate;
