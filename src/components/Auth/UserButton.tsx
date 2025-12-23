import React, { useState, useEffect } from 'react';
import { authClient } from '../../lib/auth';
import AuthModal from './AuthModal';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './Auth.css';

const UserButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const homeUrl = useBaseUrl('/');
  
  // Use the session hook from Better Auth
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = homeUrl; // Redirect to home using baseUrl
  };

  return (
    <div className="user-auth-container">
      {session ? (
        <div className="user-logged-in">
          <span className="user-name">{session.user.name}</span>
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
