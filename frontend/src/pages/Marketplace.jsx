import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Download, Play, Activity, Server, Settings, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Marketplace = () => {
  const navigate = useNavigate();

  const models = [
    { name: 'Real-ESRGAN v3', category: 'Upscaling', rating: 4.9, downloads: '1.2M', tags: ['General', '4K', '8K'] },
    { name: 'GFPGAN v1.4', category: 'Face Restoration', rating: 4.8, downloads: '980K', tags: ['Faces', 'Portraits'] },
    { name: 'RIFE HD v4', category: 'Interpolation', rating: 4.7, downloads: '650K', tags: ['60FPS', 'Smooth'] },
    { name: 'Anime4X-Ultra', category: 'Stylized', rating: 4.6, downloads: '420K', tags: ['Anime', 'Animation'] },
    { name: 'DeOldify Pro', category: 'Colorization', rating: 4.5, downloads: '310K', tags: ['Vintage', 'History'] },
    { name: 'Whisper Large v3', category: 'Audio/Text', rating: 4.9, downloads: '2.1M', tags: ['Subtitles', 'NLP'] }
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
          <button className="nav-link active"><ShoppingBag size={18}/> Model Hub</button>
          <button className="nav-link" onClick={() => navigate('/mlops')}><Activity size={18}/> MLOps</button>
          <button className="nav-link" onClick={() => navigate('/admin')}><Settings size={18}/> Admin</button>
        </div>
        
        <div className="nav-user">
          <div className="notification-bell"><Bell size={20} /></div>
          <div className="avatar">A</div>
        </div>
      </nav>

      <div className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <ShoppingBag size={28} className="text-accent" />
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>AI Model Marketplace</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {models.map((mod, i) => (
            <motion.div 
              key={mod.name}
              className="settings-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.2rem' }}>{mod.name}</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{mod.category}</div>
                </div>
                <div style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Star size={12} fill="currentColor" /> {mod.rating}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {mod.tags.map(tag => (
                  <span key={tag} style={{ background: 'var(--surface-bg)', border: '1px solid var(--surface-border)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Download size={14} /> {mod.downloads} Installs
                </div>
                <button className="btn-secondary" style={{ padding: '0.4rem 1rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <Play size={14} /> Use Model
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
