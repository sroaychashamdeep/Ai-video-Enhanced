import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getStats } from '../api/axiosClient';
import { motion } from 'framer-motion';
import { Activity, Bell, Settings, Video, TrendingUp, Zap, Clock, HardDrive } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', videos: 12, compute: 24 },
  { name: 'Tue', videos: 19, compute: 38 },
  { name: 'Wed', videos: 15, compute: 30 },
  { name: 'Thu', videos: 22, compute: 44 },
  { name: 'Fri', videos: 30, compute: 60 },
  { name: 'Sat', videos: 45, compute: 90 },
  { name: 'Sun', videos: 38, compute: 76 },
];

const Analytics = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEnhanced: 0,
    computeHours: "0.0",
    qualityBoost: "+0%",
    bandwidthSaved: "0 GB"
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-brand" style={{cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <span style={{fontWeight: 700, letterSpacing: '0.5px'}}>SmartVideo AI</span>
        </div>
        
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/dashboard')}><Video size={18}/> Studio</button>
          <button className="nav-link" onClick={() => navigate('/history')}><Activity size={18}/> History</button>
          <button className="nav-link active"><Settings size={18}/> Analytics</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell">
            <Bell size={20} />
          </div>
          <div className="user-avatar" title="Logout" onClick={handleLogout} style={{cursor: 'pointer'}}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </nav>

      <section className="hero-section" style={{marginBottom: '2rem'}}>
        <h1 className="gradient-text">Neural Network Analytics</h1>
        <p className="app-subtitle">Monitor your AI usage, compute hours, and enhancement statistics.</p>
      </section>

      <main className="app-main" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
        
        {/* KPI Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem'}}>
          <motion.div className="upload-card" style={{padding: '1.5rem'}} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Total Enhanced</div>
                <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem'}}>{stats.totalEnhanced}</div>
              </div>
              <div style={{background: 'rgba(168, 85, 247, 0.2)', padding: '0.75rem', borderRadius: '1rem'}}>
                <Video size={24} color="var(--accent-primary)" />
              </div>
            </div>
            <div style={{color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 600}}>+24% from last week</div>
          </motion.div>

          <motion.div className="upload-card" style={{padding: '1.5rem'}} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Compute Hours</div>
                <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem'}}>{stats.computeHours}h</div>
              </div>
              <div style={{background: 'rgba(236, 72, 153, 0.2)', padding: '0.75rem', borderRadius: '1rem'}}>
                <Clock size={24} color="var(--accent-secondary)" />
              </div>
            </div>
            <div style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>A100 GPU Cluster Time</div>
          </motion.div>

          <motion.div className="upload-card" style={{padding: '1.5rem'}} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Quality Boost</div>
                <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem'}}>{stats.qualityBoost}</div>
              </div>
              <div style={{background: 'rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '1rem'}}>
                <TrendingUp size={24} color="var(--accent-tertiary)" />
              </div>
            </div>
            <div style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Average sharpness increase</div>
          </motion.div>

          <motion.div className="upload-card" style={{padding: '1.5rem'}} initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
              <div>
                <div style={{color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px'}}>Bandwidth Saved</div>
                <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem'}}>{stats.bandwidthSaved}</div>
              </div>
              <div style={{background: 'rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '1rem'}}>
                <HardDrive size={24} color="var(--success-color)" />
              </div>
            </div>
            <div style={{color: 'var(--success-color)', fontSize: '0.85rem', fontWeight: 600}}>AI Compression Engine active</div>
          </motion.div>
        </div>

        {/* Charts */}
        <motion.div 
          className="upload-card" 
          style={{padding: '2rem'}}
          initial={{opacity: 0, scale: 0.98}} 
          animate={{opacity: 1, scale: 1}} 
          transition={{delay: 0.4}}
        >
          <h3 style={{marginTop: 0, marginBottom: '2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <Zap size={20} color="var(--accent-primary)"/> Weekly AI Inference Usage
          </h3>
          <div style={{height: '350px', width: '100%'}}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompute" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                  contentStyle={{background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(168, 85, 247, 0.5)', borderRadius: '8px', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="compute" name="Compute Load (GB)" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCompute)" />
                <Line type="monotone" dataKey="videos" name="Videos Enhanced" stroke="var(--accent-secondary)" strokeWidth={3} dot={{r: 4, fill: 'var(--accent-secondary)'}} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </main>
    </div>
  );
};

export default Analytics;
