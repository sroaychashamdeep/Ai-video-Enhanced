# 🚀 Smart Video Enhancer (AI Platform)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

A **Flagship AI Video Processing SaaS** designed to up-scale, restore, and colorize videos using state-of-the-art Deep Learning models (Real-ESRGAN, GFPGAN, RIFE). Built with an asynchronous, event-driven Node.js & BullMQ backend, connected to a stunning Glassmorphism React frontend over WebSockets.

---

## ✨ Features

- **Production-Grade Async Pipeline**: Upload massive 4K videos without crashing the server. Videos are processed entirely in the background using **BullMQ + Redis**.
- **Real-Time Progress Streaming**: Watch the AI Neural Engine work frame-by-frame live on your dashboard via **Socket.IO**.
- **Interactive UI**: A premium dark-mode, glassmorphic UI styled for enterprise AI platforms (similar to RunwayML, Topaz Labs). Features an interactive Before/After comparison slider.
- **Deep Learning Suite Integration**:
  - `Real-ESRGAN` for 4x Video Upscaling
  - `GFPGAN` for AI Face Restoration
  - `RIFE` for 60fps Frame Interpolation
  - `DeOldify` for Black & White Video Colorization
  - `OpenAI Whisper` for accurate transcriptions
- **Analytics Dashboard**: Tracks usage statistics, compute hours, and total GBs saved directly from **MongoDB**.

## 🏗️ Architecture Stack

- **Frontend**: React (Vite), Framer Motion, Tailwind CSS principles, Recharts, jsPDF
- **Backend API**: Node.js, Express, JWT Auth, Multer
- **Queueing Engine**: Redis & BullMQ
- **Database**: MongoDB & Mongoose
- **AI Worker Node**: Python 3, PyTorch, OpenCV, FFmpeg
- **Real-Time Engine**: Socket.IO

## 🚀 Getting Started

### 1. Requirements
- Docker Desktop
- Node.js v18+
- Python 3.10+
- FFmpeg (Must be in system PATH)

### 2. Infrastructure
Start the Redis and MongoDB containers:
```bash
docker-compose up -d
```

### 3. Backend & AI Engines
```bash
cd backend
npm install
npm start
```
*Note: The Python models are pre-stubbed for demonstration purposes. If you wish to use real models, drop the weights into `/ai_service/models/` and install `torch`.*

### 4. Frontend Studio
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` to access the neural engine dashboard!

## 📜 License
MIT License
