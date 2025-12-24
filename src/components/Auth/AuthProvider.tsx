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
      console.log("[Auth] Current Storage Keys:", Object.keys(localStorage));
      console.log("[Auth] Checking session status...");
      const sessionRes = await authClient.getSession();
      console.log("[Auth] getRawSession response:", sessionRes);
      
      if (sessionRes.data) {
        console.log("[Auth] Active session found for:", sessionRes.data.user.email);
        setSession(sessionRes.data.session);
        setUser(sessionRes.data.user as User);
        
        // Fetch the signed JWT for backend verification
        try {
          console.log("[Auth] Retrieving signed JWT...");
          const tokenRes = await authClient.token();
          console.log("[Auth] Token Response:", tokenRes);
          
          if (tokenRes.data?.token) {
            console.log("[Auth] JWT successfully retrieved and persisted to localStorage");
            setToken(tokenRes.data.token);
            localStorage.setItem("better-auth.jwt", tokenRes.data.token);
          } else if (tokenRes.error?.status === 401) {
            console.warn("[Auth] Token unauthorized - clearing local cache");
            setToken(null);
            localStorage.removeItem("better-auth.jwt");
          } else {
            console.warn("[Auth] No token returned:", tokenRes.error);
            setToken(null);
          }
        } catch (tokenErr) {
          console.error("[Auth] Unexpected error during JWT retrieval:", tokenErr);
          setToken(null);
        }
      } else {
        console.log("[Auth] No guest or active session (Response data is null)");
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
    console.log("[Auth] Initiating sign out...");
    
    // 1. Tentatively clear internal state to keep UI responsive
    setUser(null);
    setSession(null);
    setToken(null);

    try {
      // 2. Attempt server-side sign out
      await authClient.signOut();
      console.log("[Auth] Server-side sign out successful");
    } catch (error) {
      console.warn("[Auth] Server-side sign out reached an error (common in cross-origin):", error);
    } finally {
      // 3. Force-clear all storage regardless of server response
      Object.keys(localStorage).forEach(key => {
        if (key.includes('better-auth')) {
          localStorage.removeItem(key);
        }
      });
      console.log("[Auth] Total local purge complete. Reloading...");
      window.location.reload();
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
