import React, { useState } from 'react';
import SignupForm from './SignupForm';
import SigninForm from './SigninForm';
import './Auth.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'signin' | 'signup'>('signup');

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        {view === 'signup' ? (
          <SignupForm 
            onSuccess={onClose} 
            onSwitchToSignin={() => setView('signin')} 
          />
        ) : (
          <SigninForm 
            onSuccess={onClose} 
            onSwitchToSignup={() => setView('signup')} 
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
