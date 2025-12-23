import React, { useState } from 'react';
import { authClient } from '../../lib/auth';
import { useAuth } from './AuthProvider';
import './Auth.css';

interface SigninFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

const SigninForm: React.FC<SigninFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refresh } = useAuth();

  const handleSignin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) throw new Error(authError.message);
      
      // Update global auth state immediately
      await refresh();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form glassmorphism">
      <h2>Welcome Back</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="form-step">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleSignin} disabled={isSubmitting || !email || !password}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
        <p>Don't have an account? <span onClick={onSwitchToSignup} className="link">Sign Up</span></p>
      </div>
    </div>
  );
};

export default SigninForm;
