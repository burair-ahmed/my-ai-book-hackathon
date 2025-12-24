import React, { useState } from 'react';
import { authClient } from '../../lib/auth';
import { useAuth } from './AuthProvider';
import './Auth.css';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToSignin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToSignin }) => {
  const { refresh } = useAuth();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [software, setSoftware] = useState<string[]>([]);
  const [hardware, setHardware] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("[Signup] Attempting signup for:", email);
      const res = await authClient.signUp.email({
        email,
        password,
        name,
      });
      console.log("[Signup] Raw response:", res);

      if (res.error) {
        setError(res.error.message || 'Signup failed');
      } else {
        // Manual persistence logic: save the opaque session token and user profile
        if (res.data?.token) {
          localStorage.setItem("better-auth.session_token", res.data.token);
          console.log("[Signup] Token manually saved to localStorage");
        }
        if (res.data?.user) {
          localStorage.setItem("better-auth.user", JSON.stringify(res.data.user));
          console.log("[Signup] User profile manually saved to localStorage");
        }

        // Wait for session to be established
        await new Promise(r => setTimeout(r, 800));
        await refresh();

        // Capture JWT directly from client and sync preferences to backend
        try {
          const { data: tokenData } = await authClient.token();
          const jwt = tokenData?.token;
          
          if (jwt) {
            console.log("[Auth] Syncing preferences with JWT:", jwt.substring(0, 10) + "...");
            await fetch('https://burair-ahmed-ai-book-with-rag-chatbot.hf.space/api/profile/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
              },
              body: JSON.stringify({
                software_background: { languages: software },
                hardware_background: { platforms: hardware }
              })
            });
          }
        } catch (syncErr) {
          console.warn("[Auth] Preference sync failed:", syncErr);
        }
        onSuccess();
      }
    } catch (err) {
      console.error("[Auth] Signup error:", err);
      setError('An unexpected error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form glassmorphism">
      <h2>{step === 1 ? 'Join the Journey' : 'Personalize your Experience'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      {step === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="form-step">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button type="submit" disabled={!name || !email || !password}>
            Next: Technical Background
          </button>
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <button 
              type="button"
              onClick={onSwitchToSignin}
              style={{ background: 'none', border: 'none', color: '#6366f1', padding: 0, cursor: 'pointer' }}
            >
              Sign In
            </button>
          </p>
        </form>
      ) : (
        <div className="form-step">
          <div className="preference-section">
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Software Skills</p>
            <div className="options">
              {['Python', 'C++', 'Arduino IDE', 'ROS 2', 'Scratch'].map(s => (
                <button 
                  key={s} 
                  type="button"
                  className={software.includes(s) ? 'selected' : ''} 
                  onClick={() => toggleSelection(s, software, setSoftware)}
                >
                  {s}
                </button>
              ))}
            </div>

            <p style={{ fontSize: '0.9rem', margin: '1rem 0 0.5rem' }}>Hardware Skills</p>
            <div className="options">
              {['Arduino', 'Raspberry Pi', 'Jetson Nano', 'LEGO', 'Custom PCB'].map(h => (
                <button 
                  key={h} 
                  type="button"
                  className={hardware.includes(h) ? 'selected' : ''} 
                  onClick={() => toggleSelection(h, hardware, setHardware)}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
            <button 
              type="button" 
              className="secondary" 
              onClick={() => setStep(1)} 
              disabled={isLoading}
              style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}
            >
              Back
            </button>
            <button 
              type="button" 
              onClick={handleSignup} 
              disabled={isLoading}
              style={{ flex: 2 }}
            >
              {isLoading ? 'Finalizing...' : 'Complete Signup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
