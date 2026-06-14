import React from 'react';
import { motion } from 'framer-motion';

const AISettingsPanel = ({ settings, setSettings, isProcessing }) => {
  const toggleFeature = (feature) => {
    if (isProcessing) return;
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const updateSetting = (key, value) => {
    if (isProcessing) return;
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div 
      className="settings-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="settings-title">AI Engine Configurations</h3>
      
      {/* Upscale Factor */}
      <div className="settings-group">
        <label>Target Resolution (Upscale Factor)</label>
        <div className="segmented-control">
          {['2x', '4x', '8x'].map(factor => (
            <button
              key={factor}
              className={`segment-btn ${settings.upscale === factor ? 'active' : ''}`}
              onClick={() => updateSetting('upscale', factor)}
              disabled={isProcessing}
            >
              {factor.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Enhancement Mode */}
      <div className="settings-group">
        <label>Processing Pipeline</label>
        <select 
          className="quality-dropdown w-full"
          value={settings.mode}
          onChange={(e) => updateSetting('mode', e.target.value)}
          disabled={isProcessing}
        >
          <option value="fast">Fast (Standard Models)</option>
          <option value="standard">Balanced (Real-ESRGAN Compact)</option>
          <option value="pro">Ultra Quality (Full Ensemble)</option>
        </select>
      </div>

      {/* Toggles */}
      <div className="settings-group">
        <label>Advanced Neural Features</label>
        <div className="toggles-grid">
          
          <div className="toggle-row" onClick={() => toggleFeature('faceRestoration')}>
            <div className="toggle-info">
              <span className="toggle-name">Face Restoration</span>
              <span className="toggle-desc">GFPGAN facial enhancement</span>
            </div>
            <div className={`switch ${settings.features.faceRestoration ? 'on' : 'off'}`}></div>
          </div>

          <div className="toggle-row" onClick={() => toggleFeature('denoising')}>
            <div className="toggle-info">
              <span className="toggle-name">AI Denoising</span>
              <span className="toggle-desc">Remove grain & artifacts</span>
            </div>
            <div className={`switch ${settings.features.denoising ? 'on' : 'off'}`}></div>
          </div>

          <div className="toggle-row" onClick={() => toggleFeature('interpolation')}>
            <div className="toggle-info">
              <span className="toggle-name">Frame Interpolation</span>
              <span className="toggle-desc">Smooth to 60 FPS</span>
            </div>
            <div className={`switch ${settings.features.interpolation ? 'on' : 'off'}`}></div>
          </div>

          <div className="toggle-row" onClick={() => toggleFeature('color')}>
            <div className="toggle-info">
              <span className="toggle-name">Color Enhancement</span>
              <span className="toggle-desc">Deep learning color grade</span>
            </div>
            <div className={`switch ${settings.features.color ? 'on' : 'off'}`}></div>
          </div>

        </div>
      </div>

    </motion.div>
  );
};

export default AISettingsPanel;
