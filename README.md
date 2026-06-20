# 🚀 Smart Video Enhancer V3.0 (AI Media Intelligence Platform)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

An **Enterprise-Grade AI Media Intelligence Platform** demonstrating Full-Stack Engineering, MLOps, Cloud-Native deployment, and advanced Deep Learning pipelines. V3.0 expands the core upscaler into an 8-module suite featuring AutoML, Model Marketplaces, A/B Testing, and Developer APIs.

---

## 🏗 Enterprise Cloud Architecture

```mermaid
graph TD
    subgraph Frontend [React Web Client]
        UI[UI Components] --> Store[State Management]
        Store --> WS[WebSocket Client]
        Store --> REST[REST Client]
    end

    subgraph K8s [Kubernetes Cluster]
        subgraph Ingress [Nginx Ingress / API Gateway]
            REST --> ApiGate[API Gateway]
            WS --> ApiGate
        end

        subgraph NodeBackend [Node.js Microservices]
            ApiGate --> Auth[Auth Service]
            ApiGate --> JobMan[Job Manager]
            ApiGate --> WebSock[WebSocket Server]
            JobMan --> BullMQ[BullMQ Producer]
        end

        subgraph Storage [Databases]
            Auth --> Mongo[(MongoDB Users)]
            JobMan --> Mongo[(MongoDB Jobs)]
            BullMQ --> Redis[(Redis ElastiCache)]
        end

        subgraph PythonWorkers [A100 GPU Node Group]
            Redis --> Worker1[Worker: Upscale / ESRGAN]
            Redis --> Worker2[Worker: NLP / Whisper]
            Worker1 --> S3[(AWS S3 Out)]
            Worker2 --> S3
        end
    end
```

## ✨ Major V3.0 Features

- **AI Media Suite**: 8 distinct tools including Video Enhancement, AI Subtitles, Voice Isolation, Scene Intelligence, and Background Removal.
- **MLOps & A/B Testing**: Track experiment loss metrics, evaluate longitudinal training charts, and visually compare Models A/B side-by-side.
- **AutoML Copilot**: An intelligent agent that pre-analyzes metadata/blur/lighting to recommend the perfect pipeline and estimate GPU processing time.
- **Developer API Portal**: Secure JWT endpoint authentication, API key generation, and rate-limiting dashboards.
- **Enterprise RBAC**: Administrator panel with Role-Based Access Control and a live security Audit Log.
- **Infrastructure Monitoring**: Grafana/Prometheus styled live UI charting simulated cluster CPU, GPU VRAM, and Redis Job Queues.

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
