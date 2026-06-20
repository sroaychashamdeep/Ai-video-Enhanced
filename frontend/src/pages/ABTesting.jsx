import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Play, CheckCircle, BarChart2, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ABTesting = () => {
  const navigate = useNavigate();
  const [running, setRunning] = useState(false);
  
  const data = [
    { metric: 'PSNR (Higher is better)', ModelA: 31.4, ModelB: 34.2 },
    { metric: 'SSIM (Higher is better)', ModelA: 0.89, ModelB: 0.94 },
    { metric: 'LPIPS (Lower is better)', ModelA: 0.12, ModelB: 0.08 },
    { metric: 'Inference Time (ms)', ModelA: 140, ModelB: 85 }
  ];

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
          <button className="nav-link active"><GitBranch size={18}/> A/B Testing</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell"><Bell size={20} /></div>
          <div className="avatar">A</div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GitBranch size={28} className="text-accent" />
            <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Live A/B Model Testing</h2>
          </div>
          <button className="btn-upload" onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 2000) }} disabled={running}>
            <Play size={18} /> {running ? 'Running Tests...' : 'Run Benchmark Batch'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="settings-panel" style={{ border: '1px solid var(--accent-primary)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-primary)' }}></div>
            <h3 style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Model A</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-ESRGAN v3</span>
            </h3>
            <div style={{ width: '100%', height: '200px', background: '#000', borderRadius: '8px', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
               <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600" alt="Model A Output" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               {running && <div className="pulse-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(139, 92, 246, 0.4)', backdropFilter: 'blur(4px)' }}></div>}
            </div>
          </div>
          
          <div className="settings-panel" style={{ border: '1px solid var(--accent-secondary)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-secondary)' }}></div>
            <h3 style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Model B</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Anime4X Custom (Winner <CheckCircle size={14} color="#10b981" />)</span>
            </h3>
            <div style={{ width: '100%', height: '200px', background: '#000', borderRadius: '8px', border: '1px solid var(--surface-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
               <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=100&w=600" alt="Model B Output" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1) saturate(1.2)' }} />
               {running && <div className="pulse-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(236, 72, 153, 0.4)', backdropFilter: 'blur(4px)' }}></div>}
            </div>
          </div>
        </div>

        <div className="settings-panel">
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={20} /> Quantitative Comparison
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
                <YAxis dataKey="metric" type="category" stroke="var(--text-primary)" fontSize={12} width={150} />
                <Tooltip contentStyle={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)' }} />
                <Bar dataKey="ModelA" fill="var(--accent-primary)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="ModelB" fill="var(--accent-secondary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABTesting;
