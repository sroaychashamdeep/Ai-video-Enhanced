console.log("videoRoutes loaded");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const path = require("path");
const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('ffprobe-static').path;
ffmpeg.setFfprobePath(ffprobePath);

const { videoQueue } = require("../config/queue");
const Video = require("../models/Video");
const User = require("../models/User");

router.post(
  "/upload",
  upload.single("video"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    try {
      const inputPath = req.file.path;
      const outputFilename = "enhanced_" + req.file.filename;
      const outputPath = path.join(__dirname, "../../ai_service/output", outputFilename);
      
      let qualitySettings = req.body.quality || "standard";
      try {
        const parsed = JSON.parse(qualitySettings);
        qualitySettings = parsed;
      } catch(e) {
        qualitySettings = { mode: qualitySettings };
      }

      // 1. Extract Metadata
      ffmpeg.ffprobe(inputPath, async (err, metadata) => {
        let videoMeta = { resolution: "Unknown", fps: "30.00", duration: 0, bitrate: 0, codec: "Unknown", size: req.file.size };
        if (!err && metadata) {
          const videoStream = metadata.streams.find(s => s.codec_type === 'video');
          if (videoStream) {
            let fpsCalc = 30;
            try {
              const parts = videoStream.r_frame_rate.split('/');
              fpsCalc = parts[0] / parts[1];
            } catch(e) {}
            videoMeta = {
              resolution: `${videoStream.width || 1920}x${videoStream.height || 1080}`,
              fps: fpsCalc.toFixed(2),
              duration: metadata.format.duration || 0,
              bitrate: metadata.format.bit_rate || 0,
              codec: (videoStream.codec_name || 'h264').toUpperCase(),
              size: req.file.size
            };
          }
        }

        // 2. Create Video DB Record
        const newVideo = await Video.create({
          user: req.user.id,
          jobId: `job_${Date.now()}`,
          originalName: req.file.originalname,
          originalFile: req.file.filename,
          enhancedFile: outputFilename,
          qualitySettings,
          metadata: videoMeta,
          status: 'In Queue'
        });

        // 3. Add to BullMQ
        const job = await videoQueue.add('enhance', {
          videoId: newVideo._id,
          inputPath,
          outputPath,
          qualitySettings
        });

        // Update with actual BullMQ jobId
        newVideo.jobId = job.id;
        await newVideo.save();

        // 4. Update User History
        await User.findByIdAndUpdate(req.user.id, {
          $push: { videos: newVideo._id }
        });

        res.json({
          message: "Video Uploaded Successfully. AI Processing queued.",
          jobId: job.id,
          originalFile: req.file.filename,
          enhancedFile: outputFilename,
          metadata: videoMeta
        });
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error during upload" });
    }
  }
);

router.get("/status/:jobId", async (req, res) => {
  try {
    const job = await videoQueue.getJob(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const videoRecord = await Video.findOne({ jobId: req.params.jobId });
    if (!videoRecord) return res.status(404).json({ message: "Video record not found" });

    const progress = await job.progress();

    res.json({
      progress: progress || videoRecord.progress,
      status: videoRecord.status,
      enhancedFile: videoRecord.enhancedFile,
      metadata: videoRecord.metadata,
      completed: videoRecord.status === 'Processing Complete',
      error: videoRecord.status === 'Failed'
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching status", error: error.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'videos',
      options: { sort: { createdAt: -1 } }
    });
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Map Mongoose documents to the format expected by the frontend
    const mappedVideos = user.videos.map(v => ({
      id: v.jobId,
      originalName: v.originalName,
      enhancedFile: v.enhancedFile,
      quality: v.qualitySettings?.mode,
      metadata: v.metadata,
      date: v.createdAt,
      status: v.status
    }));

    res.json({ videos: mappedVideos });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('videos');
    if (!user) return res.status(404).json({ message: "User not found" });

    // Calculate dynamic stats
    const totalVideos = user.videos.length;
    let computeHours = 0;
    let qualityBoost = 0;
    let bandwidthSaved = 0;

    user.videos.forEach(v => {
      computeHours += (v.processingTime || 0) / 3600; // Assuming processingTime is in seconds
      qualityBoost += v.metrics?.sharpnessImprovement || 0;
      // Mock bandwidth saving logic: 10% of size saved
      bandwidthSaved += (v.metadata?.size || 0) * 0.1; 
    });

    if (totalVideos > 0) qualityBoost = Math.round(qualityBoost / totalVideos);
    bandwidthSaved = Math.round(bandwidthSaved / (1024 * 1024 * 1024)); // To GB

    res.json({
      totalEnhanced: totalVideos,
      computeHours: computeHours.toFixed(1),
      qualityBoost: `+${qualityBoost}%`,
      bandwidthSaved: `${bandwidthSaved} GB`
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;