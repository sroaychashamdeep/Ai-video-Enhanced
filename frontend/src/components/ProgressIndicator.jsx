import React from 'react';

const ProgressIndicator = ({ progress, status }) => {
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-status">{status}</span>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar-wrapper">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
