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
  token: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      console.log("Checking session...");
      const { data } = await authClient.getSession();
      console.log("Session fetched:", !!data);
      
      if (data) {
        setSession(data.session);
        setUser(data.user as User);
        
        // Get JWT for backend verification
        try {
          const { data: tokenData } = await authClient.token();
          console.log("JWT fetched:", !!tokenData?.token);
          setToken(tokenData?.token || null);
        } catch (tokenErr) {
          console.error("JWT fetch failed:", tokenErr);
          setToken(null);
        }
      } else {
        setSession(null);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setSession(null);
      setUser(null);
      setToken(null);
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
      setToken(null);
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
    <AuthContext.Provider value={{ user, session, token, isLoading, logout, refresh }}>
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
