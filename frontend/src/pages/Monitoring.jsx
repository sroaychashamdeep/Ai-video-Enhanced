import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Server, Cpu, HardDrive, Video, Settings, Bell } from 'lucide-react';

const Monitoring = () => {
  const [metrics, setMetrics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock live system metrics updating every 2 seconds
    const interval = setInterval(() => {
      const now = new Date();
      setMetrics(prev => {
        const newMetrics = [...prev, {
          time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
          cpu: Math.floor(Math.random() * 40) + 30, // 30-70%
          ram: Math.floor(Math.random() * 20) + 60, // 60-80%
          vram: Math.floor(Math.random() * 50) + 40, // 40-90%
          queue: Math.floor(Math.random() * 5),
        }];
        // Keep last 20 points
        if (newMetrics.length > 20) return newMetrics.slice(newMetrics.length - 20);
        return newMetrics;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

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
          <button className="nav-link" onClick={() => navigate('/analytics')}><Settings size={18}/> Analytics</button>
          <button className="nav-link active"><Server size={18}/> Monitoring</button>
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
          <Server size={28} className="text-accent" />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Infrastructure Monitoring</h2>
          <div style={{ background: '#10b981', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>LIVE</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="settings-panel" style={{ padding: '1rem', borderLeft: '4px solid #10b981' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>K8s Worker Pods</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>5 <span style={{fontSize: '0.8rem', color: '#10b981'}}>Online</span></div>
          </div>
          <div className="settings-panel" style={{ padding: '1rem', borderLeft: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Redis Job Queue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics[metrics.length-1]?.queue || 0}</div>
          </div>
          <div className="settings-panel" style={{ padding: '1rem', borderLeft: '4px solid #ec4899' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Failed Jobs (24h)</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ec4899' }}>0.01%</div>
          </div>
          <div className="settings-panel" style={{ padding: '1rem', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cluster CPU</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics[metrics.length-1]?.cpu || 0}%</div>
          </div>
          <div className="settings-panel" style={{ padding: '1rem', borderLeft: '4px solid #eab308' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>A100 GPU Mem</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{metrics[metrics.length-1]?.vram || 0}%</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="settings-panel" style={{ padding: '1rem' }}>
            <h3 style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={14} /> GPU Memory Utilization (Prometheus)</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorVram" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="time" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                  <Area type="step" dataKey="vram" stroke="#eab308" fillOpacity={1} fill="url(#colorVram)" strokeWidth={2} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="settings-panel" style={{ padding: '1rem' }}>
            <h3 style={{ marginTop: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cpu size={14} /> CPU / System RAM Load</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="time" stroke="#666" fontSize={10} />
                  <YAxis stroke="#666" fontSize={10} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="ram" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
