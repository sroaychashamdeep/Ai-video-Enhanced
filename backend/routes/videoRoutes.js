console.log("videoRoutes loaded");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const { spawn } = require("child_process");
const path = require("path");
const { getUsers, saveUsers } = require("./authRoutes");

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
    // Use the virtual environment python if it exists
    const pythonExe = path.join(__dirname, "../../.venv/Scripts/python.exe");

    const quality = req.body.quality || "standard";

    // Start background processing
    const process = spawn(pythonExe, [pythonScript, "-i", inputPath, "-o", outputPath, "-q", quality]);

    process.stdout.on("data", (data) => {
      console.log(`[AI-Service]: ${data}`);
    });

    process.stderr.on("data", (data) => {
      console.error(`[AI-Service Error]: ${data}`);
    });

    process.on("close", (code) => {
      console.log(`AI Processing finished with code ${code}`);
    });

    // Save to user history
    if (req.user) {
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === req.user.id);
      if (userIndex !== -1) {
        if (!users[userIndex].videos) {
          users[userIndex].videos = [];
        }
        users[userIndex].videos.push({
          id: Date.now().toString(),
          originalName: req.file.originalname,
          enhancedFile: outputFilename,
          quality: quality,
          date: new Date().toISOString()
        });
        saveUsers(users);
      }
    }

    res.json({
      message: "Video Uploaded Successfully. AI Processing started.",
      originalFile: req.file.filename,
      enhancedFile: outputFilename
    });
  }
);

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