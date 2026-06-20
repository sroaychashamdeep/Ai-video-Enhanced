import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Activity, Settings, Server, Bell, Database, Cpu, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const ModelTraining = () => {
  const navigate = useNavigate();
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);

  const startTraining = () => {
    setTraining(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTraining(false);
          return 100;
        }
        return p + 2;
      });
    }, 200);
  };

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="nav-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <span style={{fontWeight: 700, letterSpacing: '0.5px'}}>SmartVideo AI</span>
        </div>
        
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/dashboard')}><Video size={18}/> Studio</button>
          <button className="nav-link" onClick={() => navigate('/history')}><Activity size={18}/> History</button>
          <button className="nav-link active"><Database size={18}/> Training Studio</button>
          <button className="nav-link" onClick={() => navigate('/monitoring')}><Server size={18}/> Monitoring</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell">
            <Bell size={20} />
            <span className="badge">3</span>
          </div>
          <div className="avatar">A</div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Database size={28} className="text-accent" />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Custom Model Fine-Tuning</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div className="settings-panel">
              <h3 style={{ marginTop: 0 }}>Configure Dataset</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Upload your own high-resolution/low-resolution video pairs to fine-tune the Real-ESRGAN or GFPGAN models to your specific camera lens or style.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Base Model Architecture</label>
                  <select className="settings-panel" style={{ width: '100%', padding: '0.75rem', background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', color: 'white', borderRadius: '8px' }}>
                    <option>Real-ESRGAN (General Upscaling)</option>
                    <option>GFPGAN (Face Restoration)</option>
                    <option>RIFE (Frame Interpolation)</option>
                  </select>
                </div>
                
                <div style={{ border: '2px dashed var(--surface-border)', padding: '2rem', textAlign: 'center', borderRadius: '12px', background: 'var(--surface-bg)' }}>
                  <Database size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                  <div style={{ fontWeight: 600 }}>Select Dataset Archive (.zip)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Expected format: /hr, /lr folders containing paired frames</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="settings-panel">
              <h3 style={{ marginTop: 0 }}>Training Compute Setup</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--accent-primary)', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', cursor: 'pointer' }}>
                  <Cpu size={24} color="var(--accent-primary)" style={{marginBottom: '0.5rem'}} />
                  <div style={{fontWeight: 600}}>A100 Cluster</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>$4.50 / hr</div>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--surface-border)', borderRadius: '8px', background: 'var(--surface-bg)', cursor: 'pointer' }}>
                  <Cpu size={24} color="var(--text-muted)" style={{marginBottom: '0.5rem'}} />
                  <div style={{fontWeight: 600}}>V100 Node</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>$1.20 / hr</div>
                </div>
              </div>

              {training ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Epoch {Math.floor(progress/5)}/20...</span>
                    <span style={{ fontWeight: 'bold' }}>{progress}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div 
                      style={{ height: '100%', background: 'var(--accent-primary)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    Loss: {(0.5 - (progress/200)).toFixed(4)} | PSNR: {(25 + (progress/5)).toFixed(2)} dB
                  </div>
                </div>
              ) : (
                <button className="btn-upload" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }} onClick={startTraining}>
                  <Play size={18} /> Start Fine-Tuning Job
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTraining;
