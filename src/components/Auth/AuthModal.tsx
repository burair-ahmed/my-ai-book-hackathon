import React, { useState } from 'react';
import SigninForm from './SigninForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'signin' | 'signup'>('signin');

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>&times;</button>
        {view === 'signin' ? (
          <SigninForm 
            onSuccess={onClose} 
            onSwitchToSignup={() => setView('signup')} 
          />
        ) : (
          <SignupForm 
            onSuccess={onClose} 
            onSwitchToSignin={() => setView('signin')} 
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
