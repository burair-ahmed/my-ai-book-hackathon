import React from 'react';
import ChatBot from '../components/ChatBot/ChatBot';
import { AuthProvider } from '../components/Auth/AuthProvider';

interface RootProps {
  children: React.ReactNode;
}

export default function Root({children}: RootProps) {
  return (
    <AuthProvider>
      {children}
      <ChatBot />
    </AuthProvider>
  );
}
