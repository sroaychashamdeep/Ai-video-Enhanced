const express = require("express");
const cors = require("cors");
const videoRoutes = require("./routes/videoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/video", videoRoutes);

app.get("/", (req,res)=>{
    res.send("Backend Running");
});

app.get("/test", (req, res) => {
  res.send("Test Route Working");
});
app.listen(5000, ()=>{
    console.log("Server running on port 5000");
});