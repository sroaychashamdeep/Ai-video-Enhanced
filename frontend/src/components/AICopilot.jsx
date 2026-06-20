import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const AICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-glow)',
            color: 'white'
          }}
        >
          <Bot size={28} />
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '5rem',
              right: '2rem',
              width: '350px',
              background: 'var(--surface-bg)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '1rem',
              padding: '1.5rem',
              zIndex: 1001,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                <Bot size={20} /> AI Copilot
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <p style={{ margin: '0 0 1rem 0' }}>I detected high compression artifacts and motion blur in your recent upload.</p>
              
              <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.8rem' }}>RECOMMENDED PIPELINE:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(168, 85, 247, 0.15)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <Sparkles size={16} color="var(--accent-primary)" /> 4X Real-ESRGAN
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(236, 72, 153, 0.15)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                  <ShieldCheck size={16} color="var(--accent-secondary)" /> GFPGAN Face Restore
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>89%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Est. Improvement</div>
                </div>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>2.4m</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Est. Process Time</div>
                </div>
              </div>

              <button className="btn-upload" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <Zap size={16} /> Apply Recommendation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AICopilot;
