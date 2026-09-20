const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true
    },
    areaSqft: {
      type: Number,
      required: [true, 'Area in Sqft is required'],
      min: [1, 'Area must be greater than 0']
    },
    budget: {
      type: Number,
      required: [true, 'Project budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    location: {
      type: String,
      required: [true, 'Project location is required'],
      trim: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    currentStage: {
      type: String,
      enum: [
        'Planning',
        'Excavation',
        'Foundation',
        'Framing & Structure',
        'Masonry & Brickwork',
        'Roofing',
        'Plumbing & Electrical',
        'Finishing & Flooring',
        'Completed'
      ],
      default: 'Planning'
    },
    homeownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Homeowner ID is required']
    },
    contractorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes for high-performance lookups
projectSchema.index({ contractorId: 1 });
projectSchema.index({ homeownerId: 1 });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
