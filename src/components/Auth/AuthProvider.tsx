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
      console.log("[Auth] Checking session...");
      const { data } = await authClient.getSession();
      console.log("[Auth] getSession response:", data ? "User found" : "No user");
      
      if (data) {
        setSession(data.session);
        setUser(data.user as User);
        
        // Significant: better-auth uses the session cookie/header to issue a JWT via .token()
        try {
          console.log("[Auth] Requesting signed JWT...");
          const { data: tokenData } = await authClient.token();
          if (tokenData?.token) {
            console.log("[Auth] JWT successfully retrieved");
            setToken(tokenData.token);
          } else {
            console.warn("[Auth] No token returned from /auth/token");
            setToken(null);
          }
        } catch (tokenErr) {
          console.error("[Auth] Failed to fetch JWT (likely cross-origin/401):", tokenErr);
          setToken(null);
        }
      } else {
        console.log("[Auth] No active session found");
        setSession(null);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("[Auth] Critical error during session sync:", error);
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
