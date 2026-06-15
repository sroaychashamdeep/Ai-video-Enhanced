import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveSlider = ({ originalSrc, enhancedSrc }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMove = (event) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    let x = (event.clientX || event.touches[0].clientX) - left;
    x = Math.max(0, Math.min(x, width));
    const percent = (x / width) * 100;
    setSliderPosition(percent);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDown = () => {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const sliderHandle = document.getElementById('slider-handle');
    if (sliderHandle) {
      sliderHandle.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (sliderHandle) {
        sliderHandle.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="interactive-slider-container" 
      ref={containerRef}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleMove(e); // allow drag anywhere on container
      }}
      onTouchMove={handleMove}
    >
      <video className="video-base" src={originalSrc} autoPlay loop muted playsInline />
      
      <div 
        className="video-overlay" 
        style={{ width: `${sliderPosition}%` }}
      >
        <video className="video-enhanced" src={enhancedSrc} autoPlay loop muted playsInline />
      </div>

      <div 
        id="slider-handle"
        className="slider-handle"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="slider-line"></div>
        <div className="slider-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      <div className="labels">
        <span className="label original" style={{ opacity: sliderPosition < 20 ? 0 : 1 }}>Original</span>
        <span className="label enhanced" style={{ opacity: sliderPosition > 80 ? 0 : 1 }}>AI Enhanced</span>
      </div>
    </div>
  );
};

export default InteractiveSlider;
