import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Key, Activity, Code, Bell, Shield, Server, Box } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DeveloperPortal = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('sk_live_948f2b1a0c7d...');
  
  const usageData = Array.from({length: 7}).map((_, i) => ({
    day: `Day ${i+1}`,
    requests: Math.floor(Math.random() * 15000) + 5000
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
          <button className="nav-link active"><Terminal size={18}/> Developer API</button>
          <button className="nav-link" onClick={() => navigate('/admin')}><Shield size={18}/> Admin</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell"><Bell size={20} /></div>
          <div className="avatar">A</div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Terminal size={28} className="text-accent" />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Developer API Portal</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="settings-panel">
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={20} /> Authentication</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Use this Secret Key to authenticate all your server-side API requests.</p>
            <div style={{ background: '#000', padding: '1rem', borderRadius: '8px', border: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'monospace' }}>
              <span style={{ color: '#10b981' }}>{apiKey}</span>
              <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }} onClick={() => alert('Copied to clipboard!')}>Copy</button>
            </div>
            
            <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Monthly Quota</h4>
            <div style={{ height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
              <div style={{ height: '100%', width: '74%', background: 'var(--accent-primary)' }}></div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>74,000 / 100,000 Credits Used</div>
          </div>

          <div className="settings-panel">
            <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} /> API Usage (Last 7 Days)</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)' }} />
                  <Line type="monotone" dataKey="requests" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--accent-primary)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="settings-panel">
          <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Code size={20} /> Endpoint Documentation</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>POST</span>
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>/v1/enhance</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Initiates a new asynchronous video enhancement job. Returns a Job ID.</p>
            </div>

            <div style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>POST</span>
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>/v1/subtitle</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Generates Whisper AI transcripts and subtitle .srt files.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortal;
