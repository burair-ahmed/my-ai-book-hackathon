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
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = homeUrl;
          },
          onError: (ctx) => {
            console.error("Sign out failed:", ctx.error);
            // Fallback redirect even on error to attempt clearing local state
            window.location.href = homeUrl;
          }
        }
      });
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = homeUrl;
    }
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
