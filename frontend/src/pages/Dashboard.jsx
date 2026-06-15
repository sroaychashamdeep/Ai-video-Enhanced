import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Bell, Settings, Video } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import AISettingsPanel from '../components/AISettingsPanel';
import ProgressIndicator from '../components/ProgressIndicator';
import VideoPreview from '../components/VideoPreview';
import { uploadVideo } from '../api/axiosClient';
import { socket, connectSocket, disconnectSocket, subscribeToJob } from '../api/socket';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [enhancedFileName, setEnhancedFileName] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [videoMeta, setVideoMeta] = useState(null);

  // Advanced AI Settings
  const [aiSettings, setAiSettings] = useState({
    upscale: '4x',
    mode: 'standard',
    features: {
      faceRestoration: true,
      denoising: true,
      interpolation: false,
      color: false,
      sharpen: false,
      stabilization: false
    }
  });

  useEffect(() => {
    connectSocket();

    socket.on('progressUpdate', (data) => {
      setProgress(data.progress);
      
      let stage = 'AI Processing';
      if (data.progress < 15) stage = 'Frame Extraction';
      else if (data.progress < 45) stage = 'Real-ESRGAN Processing';
      else if (data.progress < 65) stage = 'GFPGAN Face Restoration';
      else if (data.progress < 85) stage = 'Frame Reconstruction';
      else if (data.progress < 100) stage = 'Video Rendering';
      
      setStatus(stage);
    });

    socket.on('jobCompleted', () => {
      setProgress(100);
      setStatus('Processing Complete');
      setUploadSuccess(true);
    });

    socket.on('jobFailed', (data) => {
      setStatus('Pipeline Failed: ' + (data.error || 'Unknown Error'));
      setIsUploading(false);
    });

    return () => {
      socket.off('progressUpdate');
      socket.off('jobCompleted');
      socket.off('jobFailed');
      disconnectSocket();
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setProgress(0);
    setStatus('Ready for enhancement');
    setUploadSuccess(false);
    setEnhancedFileName(null);
    setVideoMeta(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus('Initializing Pipeline');
    setProgress(0);

    try {
      const payloadString = JSON.stringify(aiSettings);
      
      const response = await uploadVideo(file, payloadString);
      
      if (response.jobId) {
        subscribeToJob(response.jobId);
        if (response.metadata) setVideoMeta(response.metadata);
        if (response.enhancedFile) setEnhancedFileName(response.enhancedFile);
      } else {
        throw new Error("No job ID returned");
      }

    } catch (error) {
      console.error('Upload Error:', error);
      setStatus('Upload Failed - Please try again');
      setIsUploading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <span style={{fontWeight: 700, letterSpacing: '0.5px'}}>SmartVideo AI</span>
        </div>
        
        <div className="nav-links">
          <button className="nav-link active"><Video size={18}/> Studio</button>
          <button className="nav-link" onClick={() => navigate('/history')}><Activity size={18}/> History</button>
          <button className="nav-link" onClick={() => navigate('/analytics')}><Settings size={18}/> Analytics</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </div>
          <div className="user-avatar" title="Logout" onClick={handleLogout} style={{cursor: 'pointer'}}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="live-dot"></span> Production Cluster Online
        </motion.div>
        
        <motion.h1 
          className="gradient-text hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Transform Low-Quality Videos Into<br/>Stunning 4K & 8K Masterpieces
        </motion.h1>
        
        <motion.p 
          className="app-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Powered by Real-ESRGAN, GFPGAN, and Advanced AI Video Restoration.
        </motion.p>
        
        <motion.div 
          className="resolution-showcase"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="res-pill dim">480p</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          <span className="res-pill">1080p</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          <span className="res-pill glow">4K</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          <span className="res-pill super-glow">8K</span>
        </motion.div>
      </section>

      {/* Main Content Layout */}
      <main className="app-main dashboard-grid">
        <div className="left-column">
          <div className="upload-card">
            <UploadArea onFileSelect={handleFileSelect} />
            
            {file && !uploadSuccess && (
              <motion.button 
                className="btn-upload btn-massive" 
                onClick={handleUpload} 
                disabled={isUploading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isUploading ? 'Initializing Neural Engine...' : 'Enhance Video Now'}
              </motion.button>
            )}

            {(isUploading || status) && file && (
              <ProgressIndicator progress={progress} status={status} file={file} aiSettings={aiSettings} />
            )}
          </div>
        </div>

        <div className="right-column">
          {file && !uploadSuccess ? (
            <AISettingsPanel 
              settings={aiSettings} 
              setSettings={setAiSettings} 
              isProcessing={isUploading} 
            />
          ) : file && uploadSuccess && enhancedFileName ? (
            <VideoPreview file={file} enhancedFileName={enhancedFileName} settings={aiSettings} metadata={videoMeta} />
          ) : (
            <div className="empty-state-panel">
              <Activity size={48} strokeWidth={1} color="var(--surface-border)" />
              <p>Select a video to access AI Settings and Preview</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
