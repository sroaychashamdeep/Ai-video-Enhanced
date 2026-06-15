const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
  stats: {
    totalVideosEnhanced: { type: Number, default: 0 },
    hoursProcessed: { type: Number, default: 0 },
    storageConsumed: { type: Number, default: 0 }, // in bytes
    averageQualityScore: { type: Number, default: 0 },
    mostUsedModel: { type: String, default: 'standard' }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
