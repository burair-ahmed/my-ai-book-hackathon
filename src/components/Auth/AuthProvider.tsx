import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authClient } from '../../lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const { data } = await authClient.getSession();
      if (data) {
        setSession(data.session);
        setUser(data.user as User);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      setSession(null);
      // Manually clear storage just in case Better Auth misses something
      Object.keys(localStorage).forEach(key => {
        if (key.includes('better-auth')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const refresh = async () => {
    setIsLoading(true);
    await fetchSession();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
