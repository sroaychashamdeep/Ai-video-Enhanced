import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, Bell, BookOpen, DownloadCloud } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Research = () => {
  const navigate = useNavigate();
  const benchmarkData = Array.from({length: 12}).map((_, i) => ({
    month: `Month ${i+1}`,
    esrganScore: 80 + (i * 0.5),
    gfpganScore: 75 + (i * 0.8),
    ourModel: 70 + (i * 2.2)
  }));

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
          <button className="nav-link" onClick={() => navigate('/dashboard')}>Suite</button>
          <button className="nav-link" onClick={() => navigate('/marketplace')}>Model Hub</button>
          <button className="nav-link" onClick={() => navigate('/mlops')}>MLOps</button>
          <button className="nav-link active"><FlaskConical size={18}/> Research</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell"><Bell size={20} /></div>
          <div className="avatar">A</div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FlaskConical size={28} className="text-accent" />
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>AI Research Center</h2>
          </div>
          <button className="btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <DownloadCloud size={18} /> Export Whitepaper PDF
          </button>
        </div>

        <div className="settings-panel" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} /> Longitudinal Benchmark Trends (SOTA Comparison)
          </h3>
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={benchmarkData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOurs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} domain={[60, 100]} />
                <Tooltip contentStyle={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)' }} />
                <Area type="monotone" dataKey="ourModel" stroke="#10b981" fillOpacity={1} fill="url(#colorOurs)" name="Our Custom SOTA Model" />
                <Area type="monotone" dataKey="esrganScore" stroke="#8b5cf6" fill="transparent" name="Real-ESRGAN Baseline" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="gfpganScore" stroke="#ec4899" fill="transparent" name="GFPGAN Baseline" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
          <div className="settings-panel">
            <h4 style={{ margin: '0 0 1rem 0' }}>Latest Publications</h4>
            <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>"Attention Mechanisms in High-FPS Temporal Interpolation" (2026)</li>
              <li>"Overcoming Artifacts in Real-time 8K Upscaling Architectures"</li>
              <li>"Latent Space Optimization for Anime Textures"</li>
            </ul>
          </div>
          <div className="settings-panel">
            <h4 style={{ margin: '0 0 1rem 0' }}>Dataset Metrics</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>14.2M</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Curated high-res/low-res training pairs</div>
          </div>
          <div className="settings-panel">
            <h4 style={{ margin: '0 0 1rem 0' }}>Global Compute Spent</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>142k Hrs</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>On A100 clusters over the last 12 months</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
