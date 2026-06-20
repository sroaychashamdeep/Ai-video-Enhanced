import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Activity, Settings, Server, Bell, PenTool, Hash, MonitorPlay, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentStudio = () => {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);

  const simulateGeneration = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
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
          <button className="nav-link" onClick={() => navigate('/dashboard')}><Video size={18}/> Suite</button>
          <button className="nav-link active"><PenTool size={18}/> Content Studio</button>
          <button className="nav-link" onClick={() => navigate('/history')}><Activity size={18}/> History</button>
          <button className="nav-link" onClick={() => navigate('/admin')}><Settings size={18}/> Admin</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell">
            <Bell size={20} />
          </div>
          <div className="avatar">A</div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <PenTool size={28} className="text-accent" />
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>AI Content Creator</h2>
          </div>
          <button className="btn-upload" onClick={simulateGeneration} disabled={generating}>
            <Sparkles size={18} /> {generating ? 'Generating...' : 'Auto-Generate Content'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="settings-panel">
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MonitorPlay size={20} color="#ef4444" /> Generated YouTube Metadata</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>Viral Title Options</label>
                <div style={{ background: 'var(--surface-bg)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--surface-border)' }}>
                  {generating ? <div className="pulse-line" style={{ width: '80%', height: '20px', background: 'var(--surface-border)', borderRadius: '4px' }}></div> : 
                    "I Upscaled a 1920s Film to 4K 60FPS (And It's Mind-Blowing!)"}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>SEO Description</label>
                <div style={{ background: 'var(--surface-bg)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--surface-border)', minHeight: '120px' }}>
                  {generating ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div className="pulse-line" style={{ width: '100%', height: '15px', background: 'var(--surface-border)', borderRadius: '4px' }}></div>
                      <div className="pulse-line" style={{ width: '90%', height: '15px', background: 'var(--surface-border)', borderRadius: '4px' }}></div>
                      <div className="pulse-line" style={{ width: '95%', height: '15px', background: 'var(--surface-border)', borderRadius: '4px' }}></div>
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      Watch as we take incredible historical footage from the 1920s and completely restore it using Real-ESRGAN and GFPGAN AI! The face restoration and frame interpolation brings history to life like never before. <br/><br/>
                      Chapters:<br/>
                      0:00 - Original Footage<br/>
                      1:20 - AI Restoration Process<br/>
                      3:45 - The Final 4K 60FPS Result
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="settings-panel">
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Hash size={20} color="var(--accent-primary)" /> Viral Hashtags</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['#AI', '#VideoRestoration', '#4K60FPS', '#MachineLearning', '#History'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="settings-panel">
              <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ImageIcon size={20} /> Scene Intelligence Report</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary Setting</div>
                  <div style={{ fontWeight: 'bold' }}>Outdoor / Historical</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Detected Objects</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
                    {['Classic Car (98%)', 'Pedestrians (94%)', 'Buildings (89%)'].map(obj => (
                      <span key={obj} style={{ fontSize: '0.75rem', background: 'var(--surface-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--surface-border)' }}>{obj}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sentiment Analysis</div>
                  <div style={{ color: '#10b981', fontWeight: 'bold' }}>Nostalgic, Energetic</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentStudio;
