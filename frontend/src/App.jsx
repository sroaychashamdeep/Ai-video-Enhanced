import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Monitoring from './pages/Monitoring';
import AdminPanel from './pages/AdminPanel';
import ModelTraining from './pages/ModelTraining';
import ContentStudio from './pages/ContentStudio';
import Marketplace from './pages/Marketplace';
import MLOps from './pages/MLOps';
import ABTesting from './pages/ABTesting';
import Research from './pages/Research';
import DeveloperPortal from './pages/DeveloperPortal';
import Footer from './components/Footer';
import AICopilot from './components/AICopilot';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/monitoring" 
          element={
            <ProtectedRoute>
              <Monitoring />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/training" 
          element={
            <ProtectedRoute>
              <ModelTraining />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/content" 
          element={
            <ProtectedRoute>
              <ContentStudio />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/marketplace" 
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mlops" 
          element={
            <ProtectedRoute>
              <MLOps />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/abtesting" 
          element={
            <ProtectedRoute>
              <ABTesting />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/research" 
          element={
            <ProtectedRoute>
              <Research />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/developer" 
          element={
            <ProtectedRoute>
              <DeveloperPortal />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <AICopilot />
      <Footer />
    </div>
  );
}

export default App;
