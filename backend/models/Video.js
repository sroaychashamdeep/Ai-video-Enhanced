const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: String, required: true, unique: true },
  originalName: { type: String, required: true },
  originalFile: { type: String, required: true },
  enhancedFile: { type: String },
  thumbnail: { type: String },
  qualitySettings: { type: Object },
  metadata: { type: Object },
  status: { type: String, default: 'pending' },
  progress: { type: Number, default: 0 },
  processingTime: { type: Number, default: 0 },
  metrics: {
    sharpnessImprovement: { type: Number },
    noiseReduction: { type: Number },
    faceRestorationScore: { type: Number },
    resolutionImprovement: { type: Number },
    overallQualityScore: { type: Number }
  },
  transcriptUrl: { type: String },
  srtUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
