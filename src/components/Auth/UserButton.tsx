import React, { useState, useEffect } from 'react';
import { authClient } from '../../lib/auth';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './Auth.css';

const UserButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const homeUrl = useBaseUrl('/');
  
  // Consume the centralized AuthContext
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // No need for manual clear here as AuthProvider handles it
    window.location.href = homeUrl;
  };

  return (
    <div className="user-auth-container">
      {user ? (
        <div className="user-logged-in">
          <span className="user-name">{user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button className="login-btn" onClick={() => setIsModalOpen(true)}>Sign In</button>
      )}
      
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default UserButton;
