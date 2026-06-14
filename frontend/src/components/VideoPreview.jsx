import React, { useEffect, useState } from 'react';

const VideoPreview = ({ file, enhancedFileName }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [enhancedVideoUrl, setEnhancedVideoUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setEnhancedVideoUrl(null);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  useEffect(() => {
    if (!enhancedFileName) return;
    
    const interval = setInterval(async () => {
      try {
        const testUrl = `http://localhost:5000/output/${encodeURIComponent(enhancedFileName)}`;
        const response = await fetch(testUrl, { method: 'HEAD', cache: 'no-store' });
        if (response.ok) {
          setEnhancedVideoUrl(testUrl);
          clearInterval(interval);
        }
      } catch (e) {
        // Just ignore and keep polling
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [enhancedFileName]);

  return (
    <div className="preview-container">
      <div className="preview-card">
        <div className="preview-header">
          <h4>Original Video</h4>
          <span className="badge badge-original">Input</span>
        </div>
        <div className="video-wrapper">
          {videoUrl ? (
            <video controls src={videoUrl} className="video-player" />
          ) : (
            <div className="video-placeholder">No video selected</div>
          )}
        </div>
      </div>

      <div className="preview-card">
        <div className="preview-header">
          <h4>Enhanced Video</h4>
          <span className="badge badge-enhanced">Output</span>
        </div>
        <div className="video-wrapper">
          {enhancedVideoUrl ? (
            <video controls src={enhancedVideoUrl} className="video-player" />
          ) : (
            <div className="video-placeholder enhanced-placeholder">
              <div className="ai-scanning">
                <svg className="ai-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI Enhancement Pending...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
