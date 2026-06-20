import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Server, Database, TrendingUp, Settings, Bell, GitBranch } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MLOps = () => {
  const navigate = useNavigate();
  const mockData = Array.from({length: 20}).map((_, i) => ({
    epoch: i+1,
    loss: 0.8 - (i * 0.035) + (Math.random() * 0.05),
    val_loss: 0.9 - (i * 0.03) + (Math.random() * 0.08)
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
          <button className="nav-link active"><Activity size={18}/> MLOps</button>
          <button className="nav-link" onClick={() => navigate('/abtesting')}><GitBranch size={18}/> A/B Testing</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell"><Bell size={20} /></div>
          <div className="avatar">A</div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Database size={28} className="text-accent" />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>MLOps Registry & Experiment Tracking</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          <div className="settings-panel">
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={20} /> Active Experiments
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RUN ID: #4492-REAL-ESRGAN-V4</div>
                <div style={{ fontWeight: 'bold', margin: '0.3rem 0' }}>Real-ESRGAN Custom Fine-Tune</div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                  <span style={{ color: '#10b981' }}>Running (Epoch 14/50)</span>
                  <span style={{ color: 'var(--text-secondary)' }}>GPU: A100-80GB</span>
                </div>
              </div>

              <div style={{ borderLeft: '3px solid var(--surface-border)', paddingLeft: '1rem', opacity: 0.6 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RUN ID: #4491-GFPGAN-LOWLIGHT</div>
                <div style={{ fontWeight: 'bold', margin: '0.3rem 0' }}>GFPGAN Low Light Adapt</div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                  <span>Completed</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Loss: 0.0412</span>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-panel">
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} /> Live Training Loss (Run #4492)
            </h3>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                  <XAxis dataKey="epoch" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)' }} />
                  <Line type="monotone" dataKey="loss" stroke="#8b5cf6" strokeWidth={2} name="Train Loss" dot={false} />
                  <Line type="monotone" dataKey="val_loss" stroke="#ec4899" strokeWidth={2} name="Val Loss" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLOps;
