import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UploadArea from '../components/UploadArea';
import ProgressIndicator from '../components/ProgressIndicator';
import VideoPreview from '../components/VideoPreview';
import { uploadVideo } from '../api/axiosClient';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState('standard');
  const [enhancedFileName, setEnhancedFileName] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setProgress(0);
    setStatus('Ready when you are! ✨');
    setUploadSuccess(false);
    setEnhancedFileName(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus('Sending to the AI lab... 🚀');

    try {
      const response = await uploadVideo(file, quality, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      });

      setStatus('Got it! Our AI is working its magic right now 🪄');
      setUploadSuccess(true);
      setEnhancedFileName(response.enhancedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus("Oops! Something went wrong on our end. Let's try that again 😅");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header dashboard-header">
        <div>
          <h1 className="gradient-text">Smart Video Enhancer</h1>
          <p className="app-subtitle">Hey {user?.name}, let's make some magic happen ✨</p>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <button onClick={() => navigate('/history')} className="btn-logout" style={{border: 'none', fontWeight: 'bold'}}>My History</button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <main className="app-main">
        <div className="upload-section">
          <UploadArea onFileSelect={handleFileSelect} />
          
          {file && (
            <div className="file-actions">
              <div className="selected-file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>
              
              {!uploadSuccess && (
                <div className="upload-controls">
                  <div className="quality-selector">
                    <label>Quality:</label>
                    <select 
                      value={quality} 
                      onChange={(e) => setQuality(e.target.value)}
                      disabled={isUploading}
                      className="quality-dropdown"
                    >
                      <option value="fast">Fast (2x Scale)</option>
                      <option value="standard">Standard (4x Scale)</option>
                      <option value="pro">Pro (AI Restoration)</option>
                    </select>
                  </div>

                  <button 
                    className="btn-upload" 
                    onClick={handleUpload} 
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Make it Awesome! ✨'}
                  </button>
                </div>
              )}
            </div>
          )}

          {(isUploading || status) && (
            <ProgressIndicator progress={progress} status={status} />
          )}
        </div>

        {file && (
          <div className="preview-section">
            <VideoPreview file={file} enhancedFileName={enhancedFileName} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
