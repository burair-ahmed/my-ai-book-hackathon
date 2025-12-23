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
      // 1. First attempt a graceful sign out with better-auth
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            // 2. Clear all auth related items from local storage manually as a fallback
            Object.keys(localStorage).forEach(key => {
              if (key.includes('better-auth') || key.includes('auth')) {
                localStorage.removeItem(key);
              }
            });
            // 3. Force a hard redirect
            window.location.href = homeUrl;
          },
          onError: (ctx) => {
            console.error("Sign out failed:", ctx.error);
            // Even if it fails, clear and redirect to ensure local state is reset
            localStorage.clear(); 
            window.location.href = homeUrl;
          }
        }
      });
    } catch (err) {
      console.error("Logout error:", err);
      // Hard reset fallback
      localStorage.clear();
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
