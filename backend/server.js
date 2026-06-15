const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const videoRoutes = require("./routes/videoRoutes");
const { router: authRoutes, authMiddleware } = require("./routes/authRoutes");

// Start BullMQ Worker
require("./workers/videoWorker");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Serve enhanced videos statically
app.use('/output', express.static(path.join(__dirname, '../ai_service/output')));

io.on("connection", (socket) => {
  console.log("Client connected via Socket.IO:", socket.id);
  
  socket.on("subscribeToJob", (jobId) => {
    socket.join(`job_${jobId}`);
    console.log(`Socket ${socket.id} subscribed to job_${jobId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const { QueueEvents } = require("bullmq");
const queueEvents = new QueueEvents("video-processing", {
  connection: { host: process.env.REDIS_HOST || '127.0.0.1', port: process.env.REDIS_PORT || 6379 }
});

queueEvents.on("progress", ({ jobId, data }) => {
  io.to(`job_${jobId}`).emit("progressUpdate", { jobId, progress: data });
});
queueEvents.on("completed", ({ jobId }) => {
  io.to(`job_${jobId}`).emit("jobCompleted", { jobId });
});
queueEvents.on("failed", ({ jobId, failedReason }) => {
  io.to(`job_${jobId}`).emit("jobFailed", { jobId, error: failedReason });
});

app.use("/api/auth", authRoutes);
app.use("/api/video", authMiddleware, videoRoutes);

app.get("/", (req,res)=>{
    res.send("Backend Running");
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});