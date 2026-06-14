const express = require("express");
const cors = require("cors");

const videoRoutes = require("./routes/videoRoutes");
const { router: authRoutes, authMiddleware } = require("./routes/authRoutes");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve enhanced videos statically
app.use('/output', express.static(path.join(__dirname, '../ai_service/output')));

app.use("/api/auth", authRoutes);
app.use("/api/video", authMiddleware, videoRoutes);

app.get("/", (req,res)=>{
    res.send("Backend Running");
});

app.listen(5000, ()=>{
    console.log("Server running on port 5000");
});