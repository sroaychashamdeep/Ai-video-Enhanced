import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Server, Database, Shield, Lock, Video, Activity, Settings, Bell, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel = () => {
  const navigate = useNavigate();
  const mockData = Array.from({length: 10}).map((_, i) => ({ name: i, jobs: Math.floor(Math.random() * 50) + 10 }));

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
          <button className="nav-link active"><Shield size={18}/> Admin Hub</button>
          <button className="nav-link" onClick={() => navigate('/monitoring')}><Server size={18}/> Monitoring</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell">
            <Bell size={20} />
            <span className="badge">3</span>
          </div>
          <div className="avatar" style={{ background: 'var(--accent-primary)' }}>SU</div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <Shield size={28} className="text-accent" />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Enterprise Admin Hub</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="settings-panel">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Total Users</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>1,248</div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.5rem' }}>+12% this week</div>
          </div>
          <div className="settings-panel">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Active API Keys</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>342</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Across 89 organizations</div>
          </div>
          <div className="settings-panel">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>GPU Credit Burn</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>4.2k <span style={{fontSize: '1rem'}}>/hr</span></div>
            <div style={{ fontSize: '0.8rem', color: '#eab308', marginTop: '0.5rem' }}>Approaching limits</div>
          </div>
          <div className="settings-panel">
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Storage Used</h4>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>14.2 TB</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>AWS S3 US-East</div>
          </div>
        </div>

        <div className="settings-panel">
          <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={18} /> Global Processing Volume
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip contentStyle={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)' }} />
                <Area type="monotone" dataKey="jobs" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorJobs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="settings-panel">
            <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} /> Recent Registrations
            </h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--surface-border)', color: 'var(--text-muted)' }}>
                  <th style={{ paddingBottom: '0.5rem' }}>User</th>
                  <th style={{ paddingBottom: '0.5rem' }}>Plan</th>
                  <th style={{ paddingBottom: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.75rem 0' }}>acme_corp_ai</td>
                  <td>Enterprise</td>
                  <td style={{ color: '#10b981' }}>Active</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--surface-border)' }}>
                  <td style={{ padding: '0.75rem 0' }}>creative_studio</td>
                  <td>Pro</td>
                  <td style={{ color: '#10b981' }}>Active</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="settings-panel">
            <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={18} /> Role-Based Access Control (RBAC)
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-bg)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Enterprise Admin</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Full system access & billing</div>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>3 Users</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-bg)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>MLOps Engineer</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Model deployment & A/B testing</div>
                </div>
                <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>12 Users</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-bg)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--surface-border)' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>API Developer</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>API key management only</div>
                </div>
                <span style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>84 Users</span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-panel" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} /> Enterprise Security & Audit Logs
          </h3>
          <div style={{ background: '#000', borderRadius: '8px', border: '1px solid var(--surface-border)', padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div><span style={{ color: '#10b981' }}>[2026-06-20 14:32:01]</span> [AUTH] Admin user 'alice_ops' rotated main database credentials.</div>
            <div><span style={{ color: '#3b82f6' }}>[2026-06-20 14:30:15]</span> [RBAC] User 'bob_dev' assigned Role: API Developer.</div>
            <div><span style={{ color: '#eab308' }}>[2026-06-20 14:15:22]</span> [SECURITY] Multiple failed login attempts from IP 192.168.1.105 blocked.</div>
            <div><span style={{ color: '#8b5cf6' }}>[2026-06-20 13:45:00]</span> [SYSTEM] Kubernetes auto-scaled GPU Node Group from 3 to 5 nodes.</div>
            <div><span style={{ color: '#10b981' }}>[2026-06-20 12:00:00]</span> [API] New API key generated for org 'creative_studio'.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
