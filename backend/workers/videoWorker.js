const { Worker } = require('bullmq');
const { spawn } = require('child_process');
const path = require('path');
const { connection } = require('../config/queue');
const Video = require('../models/Video');

const pythonExe = path.join(__dirname, "../../.venv/Scripts/python.exe");
const pythonScript = path.join(__dirname, "../../ai_service/enhance.py");

const videoWorker = new Worker('video-processing', async (job) => {
  const { inputPath, outputPath, qualitySettings, videoId } = job.data;

  // Update DB Status
  await Video.findByIdAndUpdate(videoId, { status: 'AI Processing Started' });

  return new Promise((resolve, reject) => {
    const process = spawn(pythonExe, ["-u", pythonScript, "-i", inputPath, "-o", outputPath, "-q", qualitySettings.mode]);

    process.on('error', (err) => {
      console.error('Failed to start python subprocess:', err);
      reject(err);
    });

    process.stdout.on("data", async (data) => {
      const out = data.toString();
      console.log(`[Worker ${job.id}]: ${out}`);
      
      const match = out.match(/\(([\d.]+)%\)/);
      if (match && match[1]) {
        const pct = parseFloat(match[1]);
        await job.updateProgress(pct);
        
        let stage = 'AI Processing';
        if (pct < 15) stage = 'Frame Extraction';
        else if (pct < 45) stage = 'Real-ESRGAN Processing';
        else if (pct < 65) stage = 'GFPGAN Face Restoration';
        else if (pct < 85) stage = 'Frame Reconstruction';
        else if (pct < 100) stage = 'Video Rendering';
        
        // Emitting an event or updating DB could be heavy here if done too often
        // but we'll rely on BullMQ progress events
      }
    });

    process.stderr.on("data", (data) => {
      console.error(`[Worker Error ${job.id}]: ${data}`);
    });

    process.on("close", async (code) => {
      if (code === 0) {
        await job.updateProgress(100);
        resolve({ success: true, outputPath });
      } else {
        reject(new Error(`AI Processing failed with code ${code}`));
      }
    });
  });
}, { connection });

videoWorker.on('completed', async (job, result) => {
  console.log(`Job ${job.id} completed!`);
  await Video.findByIdAndUpdate(job.data.videoId, {
    status: 'Processing Complete',
    progress: 100,
  });
});

videoWorker.on('failed', async (job, err) => {
  console.error(`Job ${job.id} failed with ${err.message}`);
  await Video.findByIdAndUpdate(job.data.videoId, {
    status: 'Failed'
  });
});

module.exports = videoWorker;
