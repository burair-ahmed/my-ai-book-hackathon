import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSelection } from './useSelection';
import './ChatBot.css';

interface Message {
  role: 'user' | 'bot';
  text: string;
  sources?: string[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selection, clearSelection } = useSelection();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() && !selection) return;

    const userMsg = input.trim() || `Explain this: ${selection.substring(0, 50)}...`;
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'bot', text: '' }]);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          selection: selection || undefined,
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.sources) {
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  return [...prev.slice(0, -1), { ...last, sources: data.sources }];
                });
              } else if (data.text) {
                botResponse += data.text;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  return [...prev.slice(0, -1), { ...last, text: botResponse }];
                });
              }
            } catch (e) {}
          }
        }
      }
      
      if (selection) clearSelection();
    } catch (error) {
      setMessages(prev => [...prev.slice(0, -1), { role: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Book Assistant</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="message bot">
                Hello! I'm your **Robotics & AI Assistant**. How can I help you explore the book today?
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.role === 'bot' ? (
                  <>
                    <ReactMarkdown>{msg.text || (isLoading && i === messages.length - 1 ? '...' : '')}</ReactMarkdown>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="message-sources">
                        <hr />
                        <small>Sources: {msg.sources.map(s => s.split('\\').pop()?.split('/').pop()).join(', ')}</small>
                      </div>
                    )}
                  </>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            {selection && (
              <div className="selection-context">
                <span><strong>Selected context active</strong></span>
                <button onClick={clearSelection} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1' }}>✕</button>
              </div>
            )}
            <div className="chatbot-input-wrapper">
              <input
                className="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask your robotics question..."
                disabled={isLoading}
              />
              <button className="chatbot-send" onClick={handleSend} disabled={isLoading || (!input.trim() && !selection)}>
                {isLoading ? '...' : '→'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
