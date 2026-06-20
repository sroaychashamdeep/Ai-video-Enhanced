import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Activity, Bell, Settings, Video, Server } from 'lucide-react';
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
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
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
    },
    pipeline: [
      { id: 'esrgan', label: 'Real-ESRGAN Upscaling', icon: '🔍' },
      { id: 'gfpgan', label: 'GFPGAN Face Restore', icon: '🤖' },
      { id: 'rife', label: 'RIFE Frame Interpolation', icon: '🎞️' }
    ]
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

    socket.on('jobCompleted', (data) => {
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
      
      const response = await uploadVideo(file, payloadString, activeModule || 'enhance');
      
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

  const [activeModule, setActiveModule] = useState(null);

  const suiteModules = [
    { id: 'enhance', title: 'Video Enhancement', desc: '4K/8K Upscaling & Face Restoration', icon: '✨', color: '#8b5cf6' },
    { id: 'subtitle', title: 'AI Subtitle Generator', desc: 'Whisper-powered transcription', icon: '📝', color: '#ec4899' },
    { id: 'thumbnail', title: 'AI Thumbnail Generator', desc: 'Optimal frame extraction', icon: '🖼️', color: '#10b981' },
    { id: 'shorts', title: 'AI Shorts Generator', desc: 'Auto-crop to 9:16 vertical', icon: '📱', color: '#f59e0b' },
    { id: 'audio', title: 'AI Audio Enhancer', desc: 'Studio quality voice cleaning', icon: '🎙️', color: '#3b82f6' },
    { id: 'voice', title: 'Voice Isolation Studio', desc: 'Remove background music/noise', icon: '🎧', color: '#6366f1' },
    { id: 'bg-remove', title: 'Background Removal', desc: 'Real-time green screen AI', icon: '🎭', color: '#14b8a6' },
    { id: 'scene', title: 'Scene Intelligence', desc: 'Detect faces, objects, and setting', icon: '🧠', color: '#f43f5e' }
  ];

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
          <button className="nav-link active" onClick={() => setActiveModule(null)}><Video size={18}/> Suite</button>
          <button className="nav-link" onClick={() => navigate('/history')}><Activity size={18}/> History</button>
          <button className="nav-link" onClick={() => navigate('/admin')}><Settings size={18}/> Admin</button>
          <button className="nav-link" onClick={() => navigate('/monitoring')}><Server size={18}/> Monitoring</button>
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

      {!activeModule ? (
        <section className="suite-hub">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <motion.h1 
              className="gradient-text hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Enterprise AI Media Suite
            </motion.h1>
            <p className="app-subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>Select an intelligent module to process your media.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
            {suiteModules.map((mod, i) => (
              <motion.div 
                key={mod.id}
                className="settings-panel"
                style={{ cursor: 'pointer', border: `1px solid ${mod.color}33`, transition: 'all 0.3s' }}
                whileHover={{ scale: 1.05, borderColor: mod.color, boxShadow: `0 0 20px ${mod.color}22` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveModule(mod.id)}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{mod.icon}</div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{mod.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      ) : (
        <>
          <button className="btn-secondary" style={{ marginBottom: '2rem' }} onClick={() => setActiveModule(null)}>← Back to Suite</button>
          
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
                activeModule === 'enhance' ? (
                  <AISettingsPanel 
                    settings={aiSettings} 
                    setSettings={setAiSettings} 
                    isProcessing={isUploading || isAnalyzing || progress > 0} 
                    analysisResult={analysisResult}
                  />
                ) : (
                  <div className="settings-panel">
                    <h3 style={{ margin: '0 0 1rem 0' }}>Module Settings</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                      Configure options for the {suiteModules.find(m => m.id === activeModule)?.title} pipeline.
                    </p>
                    {activeModule === 'subtitle' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Language</label>
                        <select style={{ width: '100%', marginBottom: '1.5rem', background: 'var(--bg-mid)', color: 'white', border: '1px solid var(--surface-border)', padding: '0.75rem', borderRadius: '8px' }}>
                          <option style={{color: 'black'}}>Auto-Detect (English default)</option>
                          <option style={{color: 'black'}}>Spanish</option>
                          <option style={{color: 'black'}}>French</option>
                          <option style={{color: 'black'}}>German</option>
                        </select>
                      </div>
                    )}
                    {activeModule === 'shorts' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Crop Tracking Mode</label>
                        <select style={{ width: '100%', marginBottom: '1.5rem', background: 'var(--bg-mid)', color: 'white', border: '1px solid var(--surface-border)', padding: '0.75rem', borderRadius: '8px' }}>
                          <option style={{color: 'black'}}>AI Face Tracking</option>
                          <option style={{color: 'black'}}>Action Tracking</option>
                          <option style={{color: 'black'}}>Center Crop</option>
                        </select>
                      </div>
                    )}
                    {activeModule === 'audio' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Enhancement Profile</label>
                        <select style={{ width: '100%', marginBottom: '1.5rem', background: 'var(--bg-mid)', color: 'white', border: '1px solid var(--surface-border)', padding: '0.75rem', borderRadius: '8px' }}>
                          <option style={{color: 'black'}}>Studio Podcast</option>
                          <option style={{color: 'black'}}>Clear Voice (Webcam)</option>
                          <option style={{color: 'black'}}>Heavy Noise Reduction</option>
                        </select>
                      </div>
                    )}
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', borderLeft: '4px solid #10b981', marginTop: 'auto' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#10b981' }}>⚡ Pipeline Optimized for Fast Simulation</p>
                    </div>
                  </div>
                )
              ) : file && uploadSuccess && enhancedFileName ? (
                activeModule === 'enhance' ? (
                  <VideoPreview file={file} enhancedFileName={enhancedFileName} settings={aiSettings} metadata={videoMeta} />
                ) : (
                  <div className="settings-panel">
                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--accent-primary)' }}>✨ Processing Complete</h3>
                    
                    {activeModule === 'subtitle' && (
                      <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>Generated SRT Transcript</h4>
                        <pre style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
1
00:00:01,000 --&gt; 00:00:04,000
This is an AI generated transcript.

2
00:00:04,500 --&gt; 00:00:08,000
Using Whisper model simulation.
                        </pre>
                        <a href={`${import.meta.env.VITE_API_URL || ''}/output/${enhancedFileName.split('.')[0]}.srt`} download className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', textDecoration: 'none' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Download .SRT File
                        </a>
                      </div>
                    )}

                    {activeModule === 'thumbnail' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: 'var(--bg-dark)', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '2px solid var(--accent-primary)', position: 'relative' }}>
                          <span style={{position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 10}}>Optimal Frame 1</span>
                          <video src={`${import.meta.env.VITE_API_URL || ''}/output/${enhancedFileName}#t=1.0`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        <div style={{ background: 'var(--bg-dark)', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                          <span style={{position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 10}}>Frame 2</span>
                          <video src={`${import.meta.env.VITE_API_URL || ''}/output/${enhancedFileName}#t=3.0`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        <div style={{ background: 'var(--bg-dark)', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                          <span style={{position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 10}}>Frame 3</span>
                          <video src={`${import.meta.env.VITE_API_URL || ''}/output/${enhancedFileName}#t=5.0`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        <div style={{ background: 'var(--bg-dark)', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                          <span style={{position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 10}}>Frame 4</span>
                          <video src={`${import.meta.env.VITE_API_URL || ''}/output/${enhancedFileName}#t=7.0`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                      </div>
                    )}

                    {activeModule === 'shorts' && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '280px', aspectRatio: '9/16', background: 'var(--bg-dark)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
                          <video src={`${import.meta.env.VITE_API_URL || ''}/output/${enhancedFileName}`} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                        </div>
                      </div>
                    )}

                    {(activeModule === 'audio' || activeModule === 'voice') && (
                      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', height: '60px', marginBottom: '2rem' }}>
                          {[...Array(20)].map((_, i) => (
                            <motion.div key={i} style={{ width: '6px', background: 'var(--accent-primary)', borderRadius: '3px' }} animate={{ height: [10, Math.random() * 50 + 10, 10] }} transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }} />
                          ))}
                        </div>
                        <a href={`${import.meta.env.VITE_API_URL || ''}/output/${enhancedFileName}`} download className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Download Clean Audio
                        </a>
                      </div>
                    )}

                    {activeModule === 'scene' && (
                      <div style={{ background: 'var(--bg-dark)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>Intelligence Report</h4>
                        <pre style={{ color: 'var(--accent-secondary)', fontSize: '0.85rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
{`{
  "status": "success",
  "confidence_score": 0.98,
  "detections": {
    "faces": [
      { "id": "person_1", "emotion": "happy", "attention": "high" }
    ],
    "objects": ["coffee cup", "laptop", "desk"],
    "setting": "Indoor office environment",
    "safety": "safe_for_work"
  }
}`}
                        </pre>
                      </div>
                    )}

                    {activeModule === 'bg-remove' && (
                      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(45deg, #1f2937 25%, transparent 25%, transparent 75%, #1f2937 75%, #1f2937), repeating-linear-gradient(45deg, #1f2937 25%, #111827 25%, #111827 75%, #1f2937 75%, #1f2937)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px', zIndex: 0 }}></div>
                        <video src={`${import.meta.env.VITE_API_URL || ''}/output/${enhancedFileName}`} controls style={{ width: '100%', borderRadius: '8px', position: 'relative', zIndex: 1, opacity: 0.85, filter: 'contrast(1.1) brightness(1.1)' }}></video>
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(16, 185, 129, 0.9)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', zIndex: 2, color: 'white', fontWeight: 'bold' }}>Simulated Transparency</div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="empty-state-panel">
                  <Activity size={48} strokeWidth={1} color="var(--surface-border)" />
                  <p>Select a video to access AI Settings and Preview</p>
                </div>
              )}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Dashboard;
