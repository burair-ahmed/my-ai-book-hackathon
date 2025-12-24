import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import './Auth.css';

const UserButton: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isLoading) return <div className="user-button-loading">...</div>;

  if (user) {
    return (
      <div className="user-profile-container">
        <div 
          className="user-avatar-trigger" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {user.image ? (
            <img src={user.image} alt={user.name} />
          ) : (
            <div className="avatar-placeholder">{user.name ? user.name[0].toUpperCase() : '?'}</div>
          )}
        </div>

        {isDropdownOpen && (
          <div className="user-dropdown-menu glassmorphism">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <hr />
            <button className="logout-btn" onClick={() => {
              logout();
              setIsDropdownOpen(false);
            }}>
              Sign Out
            </button>
          </div>
        )}
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
