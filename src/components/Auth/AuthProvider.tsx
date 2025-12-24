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
      console.log("[Auth] Checking session status...");
      const { data } = await authClient.getSession();
      
      if (data) {
        console.log("[Auth] Active session found for:", data.user.email);
        setSession(data.session);
        setUser(data.user as User);
        
        // Fetch the signed JWT for backend verification
        try {
          console.log("[Auth] Retrieving signed JWT...");
          const { data: tokenData } = await authClient.token();
          if (tokenData?.token) {
            console.log("[Auth] JWT successfully retrieved");
            setToken(tokenData.token);
          } else {
            console.warn("[Auth] No token returned from server");
            setToken(null);
          }
        } catch (tokenErr) {
          console.error("[Auth] JWT retrieval failed:", tokenErr);
          setToken(null);
        }
      } else {
        console.log("[Auth] No guest or active session");
        setSession(null);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("[Auth] Session sync error:", error);
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
      console.log("[Auth] Logging out...");
      await authClient.signOut();
      setUser(null);
      setSession(null);
      setToken(null);
      
      // Clear persistence keys to ensure clean state
      Object.keys(localStorage).forEach(key => {
        if (key.includes('better-auth')) {
          localStorage.removeItem(key);
        }
      });
      console.log("[Auth] Logout complete");
    } catch (error) {
      console.error("[Auth] Logout failed:", error);
    }
  };

  const refresh = async () => {
    console.log("[Auth] Refreshing state...");
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
