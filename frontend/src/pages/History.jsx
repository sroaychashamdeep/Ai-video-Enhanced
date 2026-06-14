import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getHistory } from '../api/axiosClient';
import { motion } from 'framer-motion';
import { Activity, Bell, Settings, Video, Search, Download, Filter, Eye } from 'lucide-react';

const History = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setVideos(data.videos || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredVideos = videos.slice().reverse().filter(v => 
    v.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.quality.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="nav-link active"><Activity size={18}/> History</button>
          <button className="nav-link" onClick={() => navigate('/analytics')}><Settings size={18}/> Analytics</button>
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

      <section className="hero-section" style={{marginBottom: '2rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <div>
          <h1 className="gradient-text" style={{fontSize: '3rem', marginBottom: '0.5rem'}}>Enhancement Archive</h1>
          <p className="app-subtitle" style={{margin: 0}}>Access all your previously mastered and upscaled footage.</p>
        </div>
        <div className="segmented-control" style={{background: 'rgba(15, 23, 42, 0.8)', padding: '0.25rem', width: '300px'}}>
          <div style={{display: 'flex', alignItems: 'center', padding: '0 0.75rem', gap: '0.5rem', width: '100%'}}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search videos..." 
              style={{background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', padding: '0.5rem 0'}}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <main className="app-main">
        {isLoading ? (
          <div style={{textAlign: 'center', marginTop: '4rem', fontSize: '1.2rem', color: 'var(--accent-primary)', animation: 'pulse 2s infinite'}}>
            Syncing from Neural Servers...
          </div>
        ) : videos.length === 0 ? (
          <div className="upload-card" style={{textAlign: 'center', margin: '0 auto', maxWidth: '600px'}}>
            <h3>No videos yet!</h3>
            <p className="upload-subtitle">Head back to the dashboard to enhance your first video.</p>
            <button className="btn-upload" onClick={() => navigate('/dashboard')} style={{marginTop: '1rem'}}>
              Go to Dashboard
            </button>
          </div>
        ) : (
          <motion.div 
            className="upload-card" 
            style={{padding: '1rem 0'}}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
          >
            <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
              <thead>
                <tr style={{borderBottom: '1px solid var(--surface-border)'}}>
                  <th style={{padding: '1rem 2rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase'}}>Video File</th>
                  <th style={{padding: '1rem 2rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase'}}>Resolution</th>
                  <th style={{padding: '1rem 2rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase'}}>Date</th>
                  <th style={{padding: '1rem 2rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase'}}>Status</th>
                  <th style={{padding: '1rem 2rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVideos.map((video, index) => (
                  <tr key={video.id} style={{borderBottom: index === filteredVideos.length - 1 ? 'none' : '1px solid var(--surface-border)', transition: 'background 0.2s', cursor: 'pointer'}} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{padding: '1.25rem 2rem'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <div style={{width: '80px', height: '45px', background: '#000', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--surface-border)'}}>
                          <video src={`http://localhost:5000/output/${encodeURIComponent(video.enhancedFile)}`} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        </div>
                        <div>
                          <div style={{fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px'}} title={video.originalName}>{video.originalName}</div>
                          <div style={{fontSize: '0.8rem', color: 'var(--accent-primary)'}}>{video.quality.toUpperCase()} ENGINE</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding: '1.25rem 2rem'}}>
                      <div style={{fontFamily: 'var(--font-mono)', fontWeight: 600}}>{video.metadata?.resolution || 'Unknown'}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{video.metadata?.fps || '30'} FPS</div>
                    </td>
                    <td style={{padding: '1.25rem 2rem', color: 'var(--text-secondary)'}}>
                      {new Date(video.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                    </td>
                    <td style={{padding: '1.25rem 2rem'}}>
                      <span className="res-pill glow" style={{fontSize: '0.75rem', padding: '0.25rem 0.75rem'}}>Completed</span>
                    </td>
                    <td style={{padding: '1.25rem 2rem'}}>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <a href={`http://localhost:5000/output/${encodeURIComponent(video.enhancedFile)}`} target="_blank" rel="noreferrer" className="btn-logout" style={{padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title="Preview">
                          <Eye size={16} />
                        </a>
                        <a href={`http://localhost:5000/output/${encodeURIComponent(video.enhancedFile)}`} download className="btn-logout" style={{padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', borderColor: 'rgba(168, 85, 247, 0.3)'}} title="Download">
                          <Download size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredVideos.length === 0 && searchTerm !== '' && (
              <div style={{padding: '3rem', textAlign: 'center', color: 'var(--text-muted)'}}>
                No videos found matching "{searchTerm}"
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default History;
