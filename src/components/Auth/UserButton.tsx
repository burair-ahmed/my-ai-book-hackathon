import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import './Auth.css';

const UserButton: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div className="user-button-loading">...</div>;

  if (user) {
    return (
      <div className="user-header-row glassmorphism">
        <div className="header-user-info">
          <div className="header-avatar-small">
            {user.image ? (
              <img src={user.image} alt={user.name} />
            ) : (
              <div className="header-avatar-placeholder">{user.name ? user.name[0].toUpperCase() : '?'}</div>
            )}
          </div>
          <span className="header-display-name">{user.name}</span>
        </div>
        <button className="header-direct-logout" onClick={() => logout()}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button className="signin-trigger-btn" onClick={() => setIsModalOpen(true)}>
        Sign In
      </button>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default UserButton;
