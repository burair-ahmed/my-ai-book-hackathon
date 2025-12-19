import React, { useState } from 'react';
import { useSelection } from './useSelection';
import './ChatBot.css';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selection, clearSelection } = useSelection();

  const handleSend = async () => {
    if (!input.trim() && !selection) return;

    const userMsg = input.trim() || `Tell me about: ${selection.substring(0, 50)}...`;
    setMessages([...messages, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          selection: selection || undefined,
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
      if (selection) clearSelection();
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
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
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <p className="message bot">Hello! I'm your AI book assistant. How can I help you today?</p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && <div className="message bot">Thinking...</div>}
          </div>

          <div className="chatbot-input-area">
            {selection && (
              <div className="selection-context">
                <strong>Selected:</strong> {selection.substring(0, 50)}...
                <button onClick={clearSelection} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
              </div>
            )}
            <input
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
            />
            <button className="chatbot-send" onClick={handleSend} disabled={isLoading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
