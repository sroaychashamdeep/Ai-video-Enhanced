console.log("videoRoutes loaded");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const { spawn } = require("child_process");
const path = require("path");
const { getUsers, saveUsers } = require("./authRoutes");

const ffmpeg = require('fluent-ffmpeg');
const ffprobePath = require('ffprobe-static').path;
ffmpeg.setFfprobePath(ffprobePath);

const activeJobs = {};

router.post(
  "/upload",
  upload.single("video"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const inputPath = req.file.path;
    const outputFilename = "enhanced_" + req.file.filename;
    const outputPath = path.join(__dirname, "../../ai_service/output", outputFilename);
    const pythonScript = path.join(__dirname, "../../ai_service/enhance.py");
    const pythonExe = path.join(__dirname, "../../.venv/Scripts/python.exe");

    let qualitySettings = req.body.quality || "standard";
    try {
      const parsed = JSON.parse(qualitySettings);
      qualitySettings = parsed.mode || "standard";
    } catch(e) {}

    const jobId = Date.now().toString();
    activeJobs[jobId] = {
      progress: 0,
      status: 'Extracting metadata...',
      startTime: Date.now(),
      completed: false,
      error: false
    };

    // Return immediately to frontend
    res.json({
      message: "Video Uploaded Successfully. AI Processing started.",
      jobId: jobId,
      originalFile: req.file.filename
    });

    // Run processing in background
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
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
      activeJobs[jobId].metadata = videoMeta;
      activeJobs[jobId].status = 'AI Processing Started';

      const process = spawn(pythonExe, [pythonScript, "-i", inputPath, "-o", outputPath, "-q", qualitySettings]);

      process.stdout.on("data", (data) => {
        const out = data.toString();
        console.log(`[AI-Service ${jobId}]: ${out}`);
        
        // Parse "Processing frame X/Y (Z.Z%)"
        const match = out.match(/\(([\d.]+)%\)/);
        if (match && match[1]) {
          const pct = parseFloat(match[1]);
          activeJobs[jobId].progress = pct;
          if (pct < 15) activeJobs[jobId].status = 'Frame Extraction';
          else if (pct < 45) activeJobs[jobId].status = 'Real-ESRGAN Processing';
          else if (pct < 65) activeJobs[jobId].status = 'GFPGAN Face Restoration';
          else if (pct < 85) activeJobs[jobId].status = 'Frame Reconstruction';
          else if (pct < 100) activeJobs[jobId].status = 'Video Rendering';
        }
      });

      process.stderr.on("data", (data) => {
        console.error(`[AI-Service Error ${jobId}]: ${data}`);
      });

      process.on("close", (code) => {
        console.log(`AI Processing ${jobId} finished with code ${code}`);
        if (code === 0) {
          activeJobs[jobId].progress = 100;
          activeJobs[jobId].status = 'Processing Complete';
          activeJobs[jobId].completed = true;
          activeJobs[jobId].enhancedFile = outputFilename;

          // Save to user history
          if (req.user) {
            const users = getUsers();
            const userIndex = users.findIndex(u => u.id === req.user.id);
            if (userIndex !== -1) {
              if (!users[userIndex].videos) users[userIndex].videos = [];
              users[userIndex].videos.push({
                id: jobId,
                originalName: req.file.originalname,
                enhancedFile: outputFilename,
                quality: qualitySettings,
                metadata: videoMeta,
                date: new Date().toISOString()
              });
              saveUsers(users);
            }
          }
        } else {
          activeJobs[jobId].status = 'Failed';
          activeJobs[jobId].error = true;
        }
      });
    });
  }
);

router.get("/status/:jobId", (req, res) => {
  const jobId = req.params.jobId;
  const job = activeJobs[jobId];
  console.log(`Polling status for job ${jobId}: ${job ? 'FOUND' : 'NOT FOUND'}`);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
});

router.get("/history", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const users = getUsers();
  const user = users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ videos: user.videos || [] });
});
router.get("/upload", (req,res)=>{
    res.send("Route Working");
});

module.exports = router;