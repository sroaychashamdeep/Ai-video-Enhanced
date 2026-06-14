import React, { useCallback, useState } from 'react';

const UploadArea = ({ onFileSelect }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('video/')) {
        onFileSelect(file);
      } else {
        alert("Oops! That doesn't look like a video file. Try again? 😅");
      }
    },
    [onFileSelect]
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('video-upload').click()}
    >
      <div className="upload-icon-wrapper">
        <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <h3 className="upload-title">Drag & Drop Video File</h3>
      <p className="upload-subtitle">or click to browse from your computer</p>
      
      <div className="upload-specs">
        <span>Supported: MP4, MOV, AVI</span>
        <span>•</span>
        <span>Max Size: 500MB</span>
      </div>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="file-input"
        id="video-upload"
      />
    </div>
  );
};

export default UploadArea;
