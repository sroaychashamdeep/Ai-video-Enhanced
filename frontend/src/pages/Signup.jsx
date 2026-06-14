import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Code, Globe } from 'lucide-react';
import '../App.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    setIsLoading(true);

    const result = await signup(name, email, password);
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
        
        <h2 className="gradient-text" style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Create Account</h2>
        <p className="auth-subtitle">Join the next generation of video creators.</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required 
            />
          </div>
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
                minLength={6}
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
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required 
              />
            </div>
          </div>
          <button type="submit" className="btn-upload auth-btn" disabled={isLoading}>
            {isLoading ? 'Setting things up...' : 'Create Account'}
          </button>
        </form>

        <div style={{display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)'}}>
          <div style={{flex: 1, height: '1px', background: 'var(--surface-border)'}}></div>
          <span style={{padding: '0 1rem', fontSize: '0.9rem'}}>Or sign up with</span>
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
        
        <p className="auth-footer" style={{marginTop: '1.5rem'}}>
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
