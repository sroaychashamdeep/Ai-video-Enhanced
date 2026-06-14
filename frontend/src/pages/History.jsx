import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getHistory } from '../api/axiosClient';
import '../App.css';

const History = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="app-container">
      <header className="app-header dashboard-header">
        <div>
          <h1 className="gradient-text">Your Enhancements</h1>
          <p className="app-subtitle">All your magic in one place ✨</p>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button onClick={() => navigate('/dashboard')} className="btn-upload">Back to Studio</button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <main className="app-main">
        {isLoading ? (
          <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading your history... ⏳</div>
        ) : videos.length === 0 ? (
          <div className="preview-card" style={{textAlign: 'center', padding: '3rem'}}>
            <h3>No videos yet!</h3>
            <p className="upload-subtitle">Head back to the studio to enhance your first video.</p>
          </div>
        ) : (
          <div className="history-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem'}}>
            {videos.slice().reverse().map(video => (
              <div key={video.id} className="preview-card">
                <div className="preview-header">
                  <span className="badge badge-enhanced">{video.quality}</span>
                  <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                    {new Date(video.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="video-wrapper">
                  <video 
                    className="video-player" 
                    controls 
                    src={`http://localhost:5000/output/${video.enhancedFile}`}
                  />
                </div>
                <div style={{marginTop: '0.5rem', fontSize: '0.9rem'}}>
                  <strong>Original:</strong> {video.originalName}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
