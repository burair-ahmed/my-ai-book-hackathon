import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { authClient } from '../../lib/auth';
import './Personalization.css';

interface ChapterPersonalizerProps {
  chapterId: string;
}

const ChapterPersonalizer: React.FC<ChapterPersonalizerProps> = ({ chapterId }) => {
  const { data: session } = authClient.useSession();
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handlePersonalize = async () => {
    if (!session) {
      alert("Please sign in to use this feature!");
      return;
    }

    setIsLoading(true);
    setIsPersonalized(true);
    setError('');
    setContent('');

    try {
      console.log("DEBUG: Full session object:", session);
      // Try to find the token in likely places
      const token = (session as any)?.token || (session as any)?.session?.token || (session as any)?.accessToken;
      console.log("DEBUG: Extracted token:", token);

      
      if (!token) {
        console.error("DEBUG: No token found in session!");
        alert("Authentication failed: No token found.");
        setIsLoading(false);
        setIsPersonalized(false);
        return;
      }
      
      const response = await fetch('http://localhost:7860/api/personalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ chapter_id: chapterId })
      });

      if (!response.ok) throw new Error("Failed to personalize content");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream available");

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setContent(prev => prev + decoder.decode(value));
      }

    } catch (e: any) {
      console.error(e);
      setError("Failed to generate personalized content. Please try again.");
      setIsPersonalized(false); // Revert UI
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null; // Or show a prompt

  return (
    <div className="chapter-personalizer">
      <div className="personalizer-controls">
        <button 
          className={`personalize-btn ${isPersonalized ? 'active' : ''}`}
          onClick={handlePersonalize}
          disabled={isLoading || isPersonalized}
        >
          {isLoading ? '✨  Personalizing...' : (isPersonalized ? '✨  Personalized View' : '✨  Personalize for Me')}
        </button>
        {isPersonalized && (
          <button className="reset-btn" onClick={() => setIsPersonalized(false)}>
            Show Original
          </button>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {isPersonalized && (
        <div className="personalized-content glassmorphism">
            {isLoading && !content && <div className="loading-skeleton">AI is reading your profile and rewriting this chapter...</div>}
            <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ChapterPersonalizer;
