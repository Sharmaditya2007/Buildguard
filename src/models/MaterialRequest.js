const mongoose = require('mongoose');

const materialRequestSchema = new mongoose.Schema(
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
    aiStatus: {
      type: String,
      enum: ['Approved', 'Flagged', 'Under Review', 'Rejected'],
      default: 'Under Review'
    },
    aiReason: {
      type: String,
      default: 'Awaiting automatic AI consumption variance evaluation'
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    requestDate: {
      type: Date,
      default: Date.now
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Contractor ID is required']
    },
    homeownerNotes: {
      type: String,
      default: '',
      trim: true
    },
    reviewedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

materialRequestSchema.index({ projectId: 1, requestDate: -1 });

const MaterialRequest = mongoose.model('MaterialRequest', materialRequestSchema);
module.exports = MaterialRequest;
