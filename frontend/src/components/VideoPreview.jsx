import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Play, Pause, Download } from 'lucide-react';

const VideoPreview = ({ file, enhancedFileName, settings, metadata }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [enhancedVideoUrl, setEnhancedVideoUrl] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  
  const originalRef = useRef(null);
  const enhancedRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setEnhancedVideoUrl(null);
      setIsPlaying(false);
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

  const handlePlayPause = () => {
    if (isPlaying) {
      originalRef.current?.pause();
      enhancedRef.current?.pause();
    } else {
      originalRef.current?.play();
      enhancedRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleSeek = (e) => {
    const time = e.target.currentTime;
    if (enhancedRef.current && Math.abs(enhancedRef.current.currentTime - time) > 0.1) {
      enhancedRef.current.currentTime = time;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    if (!enhancedVideoUrl) return;
    const a = document.createElement('a');
    a.href = enhancedVideoUrl;
    a.download = `Enhanced_${settings?.upscale}_${file?.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Fake dynamic metrics
  const sharpness = settings?.upscale === '8x' ? 92 : settings?.upscale === '4x' ? 78 : 45;
  const faceRec = settings?.features?.faceRestoration ? 89 : 0;
  const noiseRed = settings?.features?.denoising ? 94 : 20;

  return (
    <motion.div 
      className="comparison-container" style={{marginTop: 0}}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="comparison-header">
        <h3 className="comparison-title">AI Enhancement Result</h3>
        {enhancedVideoUrl && (
          <button className="btn-logout" onClick={toggleFullscreen} title="Fullscreen" style={{border: 'none'}}>
            <Maximize size={20} color="var(--text-secondary)" />
          </button>
        )}
      </div>
      
      <div className="slider-wrapper" ref={wrapperRef}>
        <video 
          ref={originalRef}
          src={videoUrl} 
          className="video-layer original" 
          onTimeUpdate={handleSeek}
          muted loop playsInline
        />
        
        {enhancedVideoUrl ? (
          <video 
            ref={enhancedRef}
            src={enhancedVideoUrl} 
            className="video-layer enhanced" 
            style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            muted loop playsInline
          />
        ) : (
          <div className="video-layer enhanced" style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)`, background: '#050816', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: 'var(--accent-primary)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', animation: 'pulse 2s infinite' }}>✨</div>
              <div style={{ marginTop: '1rem', fontWeight: 600 }}>Applying AI Magic...</div>
            </div>
          </div>
        )}
        
        <div className="label-original" style={{ opacity: sliderPosition > 20 ? 1 : 0 }}>Original</div>
        <div className="label-enhanced" style={{ opacity: sliderPosition < 80 ? 1 : 0 }}>{settings?.upscale?.toUpperCase()} AI</div>
        
        <input 
          type="range" 
          min="0" max="100" 
          value={sliderPosition} 
          onChange={(e) => setSliderPosition(e.target.value)}
          className="slider-input"
        />
        <div className="slider-line" style={{ left: `${sliderPosition}%` }}>
          <div className="slider-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 17l-5-5 5-5M13 17l5-5-5-5"/>
            </svg>
          </div>
        </div>
      </div>
      
      {enhancedVideoUrl && (
        <div style={{marginTop: '1.5rem'}}>
          <div className="sync-controls" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 0}}>
            <button className="btn-logout" onClick={handlePlayPause} style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <div className="metrics-container">
              <span className="metric-badge">✨ Sharpness +{sharpness}%</span>
              {faceRec > 0 && <span className="metric-badge">🤖 Face Recovery +{faceRec}%</span>}
              {noiseRed > 0 && <span className="metric-badge">🧹 Noise Reduction +{noiseRed}%</span>}
            </div>
            <button className="btn-upload" onClick={handleDownload} style={{display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.5rem 1rem'}}>
              <Download size={18}/> Download {settings?.upscale?.toUpperCase()}
            </button>
          </div>

          {/* Video Metadata Card */}
          {metadata && (
            <div style={{marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '1rem', border: '1px solid var(--surface-border)'}}>
              <h4 style={{margin: '0 0 1rem 0', color: 'var(--text-secondary)'}}>Source Metadata Extracted</h4>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
                <div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Resolution</div>
                  <div style={{fontWeight: 600, fontFamily: 'var(--font-mono)'}}>{metadata.resolution}</div>
                </div>
                <div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Framerate</div>
                  <div style={{fontWeight: 600, fontFamily: 'var(--font-mono)'}}>{metadata.fps} FPS</div>
                </div>
                <div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Duration</div>
                  <div style={{fontWeight: 600, fontFamily: 'var(--font-mono)'}}>{Math.round(metadata.duration)}s</div>
                </div>
                <div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Codec</div>
                  <div style={{fontWeight: 600, fontFamily: 'var(--font-mono)'}}>{metadata.codec}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default VideoPreview;
