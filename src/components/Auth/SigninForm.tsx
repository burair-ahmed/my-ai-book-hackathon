import React, { useState } from 'react';
import { authClient } from '../../lib/auth';
import { useAuth } from './AuthProvider';

interface SigninFormProps {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
}

const SigninForm: React.FC<SigninFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("[Signin] Attempting sign-in for:", email);
      const res = await authClient.signIn.email({
        email,
        password,
      });
      console.log("[Signin] Raw response:", res);

      if (res.error) {
        setError(res.error.message || 'Failed to sign in');
      } else {
        // Manual persistence logic: save the opaque session token and user profile
        if (res.data?.token) {
          localStorage.setItem("better-auth.session_token", res.data.token);
          console.log("[Signin] Token manually saved to localStorage");
        }
        if (res.data?.user) {
          localStorage.setItem("better-auth.user", JSON.stringify(res.data.user));
          console.log("[Signin] User profile manually saved to localStorage");
        }

        // Wait for session to be established
        await new Promise(r => setTimeout(r, 800));
        await refresh();
        onSuccess();
      }
    } catch (err: any) {
      console.error("[Signin] Unexpected error:", err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Sign In</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form-step">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
        Don't have an account?{' '}
        <button 
          onClick={onSwitchToSignup}
          style={{ background: 'none', border: 'none', color: '#6366f1', padding: 0, cursor: 'pointer' }}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SigninForm;
