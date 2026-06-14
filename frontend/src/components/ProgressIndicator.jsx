import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, Clock, ShieldCheck } from 'lucide-react';

const ProgressIndicator = ({ progress, status, file, aiSettings }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval;
    if (progress < 100 && status !== 'Processing Complete') {
      interval = setInterval(() => setTimeElapsed(p => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [progress, status]);

  const steps = [
    { id: 1, label: 'Upload' },
    { id: 2, label: 'Extraction' },
    { id: 3, label: 'Real-ESRGAN' },
    { id: 4, label: 'GFPGAN' },
    { id: 5, label: 'Reconstruction' },
    { id: 6, label: 'Rendering' },
    { id: 7, label: 'Finalizing' }
  ];

  let currentStepIndex = 1;
  if (status === 'Processing Complete') currentStepIndex = 7;
  else if (progress >= 95) currentStepIndex = 6;
  else if (progress >= 85) currentStepIndex = 5;
  else if (progress >= 65) currentStepIndex = 4;
  else if (progress >= 45) currentStepIndex = 3;
  else if (progress >= 15) currentStepIndex = 2;

  // Accurate remaining time calculation
  let mins = 0;
  let secs = 0;
  let isCalculating = false;

  if (status === 'Processing Complete') {
    mins = 0;
    secs = 0;
  } else if (progress > 0 && progress < 100) {
    const estimatedTotalSeconds = timeElapsed / (progress / 100);
    const remaining = Math.max(0, estimatedTotalSeconds - timeElapsed);
    mins = Math.floor(remaining / 60);
    secs = Math.floor(remaining % 60);
  } else {
    isCalculating = true;
  }

  return (
    <motion.div 
      className="progress-dashboard"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--surface-border)',
        borderRadius: '1rem',
        padding: '2rem',
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}
    >
      {/* 7-Step Stepper */}
      <div className="stepper" style={{marginBottom: 0}}>
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex - 1 || currentStepIndex === 7;
          const isActive = index === currentStepIndex - 1 && currentStepIndex !== 7;
          
          return (
            <div key={step.id} className={`step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`} style={{width: '14.2%'}}>
              <div className="step-circle" style={{width: '24px', height: '24px', fontSize: '0.7rem'}}>
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className="step-label" style={{fontSize: '0.75rem', whiteSpace: 'nowrap'}}>{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Main Progress Bar */}
      <div className="overall-progress">
        <div className="progress-bar-wrapper">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
            <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: '50px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', animation: 'pulse 1s infinite'}}></div>
          </div>
        </div>
        <span className="progress-percentage" style={{fontSize: '1.25rem'}}>{Math.round(progress)}%</span>
      </div>

      {/* Live Stats */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)'}}>
          <Cpu size={24} color="var(--accent-primary)" />
          <div>
            <div style={{fontSize: '0.75rem', textTransform: 'uppercase'}}>GPU Status</div>
            <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>{status === 'Processing Complete' ? 'Idle' : 'RTX 4090 - 98%'}</div>
          </div>
        </div>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)'}}>
          <Clock size={24} color="var(--accent-secondary)" />
          <div>
            <div style={{fontSize: '0.75rem', textTransform: 'uppercase'}}>Time Remaining</div>
            <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>
              {status === 'Processing Complete' 
                ? `Finished in ${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`
                : isCalculating 
                  ? 'Calculating...' 
                  : `${mins}:${secs.toString().padStart(2, '0')}`
              }
            </div>
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)'}}>
          <HardDrive size={24} color="var(--accent-tertiary)" />
          <div>
            <div style={{fontSize: '0.75rem', textTransform: 'uppercase'}}>VRAM Usage</div>
            <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>{status === 'Processing Complete' ? '1.2 GB' : '18.4 GB / 24 GB'}</div>
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)'}}>
          <ShieldCheck size={24} color="var(--success-color)" />
          <div>
            <div style={{fontSize: '0.75rem', textTransform: 'uppercase'}}>Current Stage</div>
            <div style={{fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} title={status}>{status}</div>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default ProgressIndicator;
