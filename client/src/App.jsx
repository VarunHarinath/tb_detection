import React, { useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import AnalysisPage from './pages/AnalysisPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  const handleLogin = (doctorId) => {
    const generatedSession = `SES-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 899)}`;
    
    setSessionData({
      doctorId: doctorId,
      sessionId: generatedSession,
      date: new Date().toLocaleDateString()
    });
    
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSessionData(null);
  };

  return (
    <>
      {isAuthenticated && sessionData ? (
        <AnalysisPage metadata={sessionData} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}
