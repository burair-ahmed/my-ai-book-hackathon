import React, { useState } from 'react';
import { authClient } from '../../lib/auth';
import { useAuth } from './AuthProvider';
import './Auth.css';

interface SignupFormProps {
  onSuccess: () => void;
  onSwitchToSignin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToSignin }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [software, setSoftware] = useState<string[]>([]);
  const [hardware, setHardware] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { refresh } = useAuth();

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSignup = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const { data, error: authError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (authError) throw new Error(authError.message);
      if (!data) throw new Error('Signup failed');

      console.log("[Signup] Account created, fetching JWT...");

      // Fetch signed JWT for backend verification
      let jwt = null;
      try {
        const { data: tokenData } = await authClient.token();
        jwt = tokenData?.token;
        console.log("[Signup] JWT retrieved:", !!jwt);
      } catch (tokenErr) {
        console.error("[Signup] JWT retrieval failed (expected if cookies blocked):", tokenErr);
      }

      // Save personalization profile - Use production URL exclusively
      const BACKEND_URL = 'https://burair-ahmed-ai-book-with-rag-chatbot.hf.space';
      if (jwt) {
        console.log("[Signup] Sending profile to backend...");
        const profileResponse = await fetch(`${BACKEND_URL}/api/profile/`, {
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

        if (!profileResponse.ok) {
          console.error("[Signup] Profile creation failed:", await profileResponse.text());
        } else {
          console.log("[Signup] Profile created successfully");
        }
      } else {
        console.warn("[Signup] Skipping profile creation due to missing JWT. User will need to personalize later.");
      }

      // Update global auth state immediately
      console.log("[Signup] Refreshing AuthProvider state...");
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
      <h2>{step === 1 ? 'Join the Robotics Journey' : 'Tell us about yourself'}</h2>
      
      {error && <div className="error-message">{error}</div>}

      {step === 1 && (
        <div className="form-step">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={() => setStep(2)} disabled={!email || !password || !name}>Next: Personalize</button>
          <p>Already have an account? <span onClick={onSwitchToSignin} className="link">Sign In</span></p>
        </div>
      )}

      {step === 2 && (
        <div className="form-step">
          <h3>Software Interest</h3>
          <div className="options">
            {['Python', 'C++', 'Arduino IDE', 'ROS 2', 'Scratch'].map(s => (
              <button key={s} className={software.includes(s) ? 'selected' : ''} onClick={() => toggleSelection(s, software, setSoftware)}>{s}</button>
            ))}
          </div>
          
          <h3>Hardware Interest</h3>
          <div className="options">
            {['Arduino', 'Raspberry Pi', 'Jetson Nano', 'LEGO Mindstorms', 'Custom PCB'].map(h => (
              <button key={h} className={hardware.includes(h) ? 'selected' : ''} onClick={() => toggleSelection(h, hardware, setHardware)}>{h}</button>
            ))}
          </div>

          <div className="button-group">
            <button className="secondary" onClick={() => setStep(1)}>Back</button>
            <button onClick={handleSignup} disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Complete Signup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
