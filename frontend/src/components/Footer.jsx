import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      borderTop: '1px solid var(--surface-border)',
      marginTop: 'auto'
    }}>
      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <span>SmartVideo AI</span>
        <span>&bull;</span>
        <span>Enterprise AI Media Intelligence Platform</span>
      </div>
      <div>&copy; {new Date().getFullYear()} ACME Corp. All systems operational.</div>
    </footer>
  );
};

export default Footer;
