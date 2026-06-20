import React from 'react';
import { motion } from 'framer-motion';
import PipelineEditor from './PipelineEditor';

const AISettingsPanel = ({ settings, setSettings, isProcessing, analysisResult }) => {
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

  const setPipeline = (updater) => {
    if (isProcessing) return;
    setSettings(prev => ({ 
      ...prev, 
      pipeline: typeof updater === 'function' ? updater(prev.pipeline) : updater 
    }));
  };

  return (
    <motion.div 
      className="settings-panel"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {analysisResult && (
        <div className="analysis-summary" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', border: '1px solid var(--accent-primary)' }}>
          <h4 style={{ color: 'var(--accent-primary)', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🧠</span> AI Pre-Analysis Complete
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Detected Meta:</p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
                <li>Resolution: {analysisResult.metadata.resolution}</li>
                <li>FPS: {analysisResult.metadata.fps}</li>
              </ul>
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Scene Classification:</p>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {analysisResult.scene?.type || 'Standard'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Conf: {((analysisResult.scene?.confidence || 0) * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Gain:</p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>+{analysisResult.estimatedQualityGain}%</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="settings-title" style={{ margin: 0 }}>AI Engine Configurations</h3>
        <button 
          className={`btn-secondary ${settings.mode === 'automl' ? 'active' : ''}`}
          style={{ 
            background: settings.mode === 'automl' ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'transparent',
            color: settings.mode === 'automl' ? 'white' : 'var(--accent-primary)',
            borderColor: 'var(--accent-primary)',
            padding: '0.2rem 0.8rem',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
          onClick={() => updateSetting('mode', settings.mode === 'automl' ? 'standard' : 'automl')}
          disabled={isProcessing}
        >
          <span style={{ fontSize: '1rem' }}>⚡</span> AutoML {settings.mode === 'automl' ? 'ON' : 'OFF'}
        </button>
      </div>

      {settings.mode === 'automl' && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            <span style={{ animation: 'pulse 2s infinite' }}>●</span> AutoML Active
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            SmartVideo AI will automatically determine the best model, enhancement chain, and parameters based on the scene intelligence engine.
          </p>
        </div>
      )}
      
      {/* Upscale Factor */}
      <div className={`settings-group ${settings.mode === 'automl' ? 'disabled-section' : ''}`} style={{ opacity: settings.mode === 'automl' ? 0.5 : 1, pointerEvents: settings.mode === 'automl' ? 'none' : 'auto' }}>
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

      <PipelineEditor pipeline={settings.pipeline} setPipeline={setPipeline} />

      {/* Basic Toggles */}
      <div className="settings-group" style={{marginTop: '1.5rem'}}>
        <label>Post-Processing Effects</label>
        <div className="toggles-grid">
          <div className="toggle-row" onClick={() => toggleFeature('color')}>
            <div className="toggle-info">
              <span className="toggle-name">Color Grade</span>
              <span className="toggle-desc">Cinematic LUTs</span>
            </div>
            <div className={`switch ${settings.features.color ? 'on' : 'off'}`}></div>
          </div>
          <div className="toggle-row" onClick={() => toggleFeature('stabilization')}>
            <div className="toggle-info">
              <span className="toggle-name">Stabilization</span>
              <span className="toggle-desc">Reduce camera shake</span>
            </div>
            <div className={`switch ${settings.features.stabilization ? 'on' : 'off'}`}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AISettingsPanel;
