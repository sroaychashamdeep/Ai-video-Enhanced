const { Worker } = require('bullmq');
const { spawn } = require('child_process');
const path = require('path');
const { connection } = require('../config/queue');
const Video = require('../models/Video');

const pythonExe = process.env.PYTHON_PATH || (process.platform === 'win32' ? path.join(__dirname, "../../.venv/Scripts/python.exe") : 'python3');
const pythonScript = path.join(__dirname, "../../ai_service/enhance.py");

const videoWorker = new Worker('video-processing', async (job) => {
  const { inputPath, outputPath, qualitySettings, videoId, moduleId } = job.data;
  const targetModule = moduleId || 'enhance';

  // Update DB Status
  await Video.findByIdAndUpdate(videoId, { status: `${targetModule.toUpperCase()} Processing Started` });

  return new Promise((resolve, reject) => {
    const pipelineStr = qualitySettings?.pipeline ? JSON.stringify(qualitySettings.pipeline) : '';
    const process = spawn(pythonExe, ["-u", pythonScript, "-i", inputPath, "-o", outputPath, "-q", qualitySettings?.mode || 'standard', "-p", pipelineStr, "-m", targetModule]);

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
        
        // Dynamic Stage Naming
        let stage = 'AI Processing';
        if (targetModule === 'enhance') {
          if (pct < 15) stage = 'Frame Extraction';
          else if (pct < 45) stage = 'Real-ESRGAN Upscaling';
          else if (pct < 65) stage = 'GFPGAN Face Restoration';
          else stage = 'Video Rendering';
        } else if (targetModule === 'subtitle') {
          if (pct < 30) stage = 'Audio Extraction';
          else if (pct < 80) stage = 'Whisper V3 Transcription';
          else stage = 'SRT Generation';
        } else if (targetModule === 'scene') {
          if (pct < 40) stage = 'Object Detection';
          else if (pct < 80) stage = 'Facial Expression Analysis';
          else stage = 'JSON Report Compilation';
        } else {
          stage = `Processing ${targetModule} (${Math.round(pct)}%)`;
        }
        
      }
    });

    process.stderr.on("data", (data) => {
      console.error(`[Worker Error ${job.id}]: ${data}`);
    });

    process.on('close', async (code) => {
      if (code !== 0) {
        await Video.findByIdAndUpdate(videoId, { status: 'Failed' });
        return reject(new Error(`Python process exited with code ${code}`));
      }

      await Video.findByIdAndUpdate(videoId, { status: 'Processing Complete', progress: 100 });
      await job.updateProgress(100);
      resolve({ status: 'Success', enhancedFile: outputPath });
    });
  });
}, { 
  connection,
  concurrency: 5 // Phase 11: Parallel Processing Support
});

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
