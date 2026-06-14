import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Code, Globe } from 'lucide-react';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container" style={{position: 'relative', zIndex: 1}}>
      {/* Background Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>

      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin: '0 auto 1rem'}}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
        </motion.div>
        
        <h2 className="gradient-text" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Welcome Back</h2>
        <p className="auth-subtitle">Log in to your AI workspace.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
              <button 
                type="button" 
                className="btn-toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button type="submit" className="btn-upload auth-btn" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : "Sign In"}
          </button>
        </form>

        <div style={{display: 'flex', alignItems: 'center', margin: '2rem 0', color: 'var(--text-muted)'}}>
          <div style={{flex: 1, height: '1px', background: 'var(--surface-border)'}}></div>
          <span style={{padding: '0 1rem', fontSize: '0.9rem'}}>Or continue with</span>
          <div style={{flex: 1, height: '1px', background: 'var(--surface-border)'}}></div>
        </div>

        <div style={{display: 'flex', gap: '1rem'}}>
          <button className="btn-logout" style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            <Globe size={18} /> Google
          </button>
          <button className="btn-logout" style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
            <Code size={18} /> GitHub
          </button>
        </div>
        
        <p className="auth-footer" style={{marginTop: '2rem'}}>
          Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
