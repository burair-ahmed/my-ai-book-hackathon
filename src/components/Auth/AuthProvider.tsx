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
      console.log("[Auth] Syncing session state...");
      console.log("[Auth] LocalStorage Keys:", Object.keys(localStorage));
      const sessionRes = await authClient.getSession();
      console.log("[Auth] getSession raw response:", sessionRes); // Added log for raw response
      
      if (sessionRes.data) {
        console.log("[Auth] Active session user:", sessionRes.data.user.email);
        setSession(sessionRes.data.session);
        setUser(sessionRes.data.user as User);
        
        try {
          const tokenRes = await authClient.token();
          if (tokenRes.data?.token) {
            setToken(tokenRes.data.token);
            localStorage.setItem("better-auth.jwt", tokenRes.data.token);
          }
        } catch (e) {
          console.warn("[Auth] Could not retrieve JWT:", e);
        }
      } else {
        console.log("[Auth] No session found, checking local hydration...");
        const localUserStr = localStorage.getItem("better-auth.user");
        const sessionToken = localStorage.getItem("better-auth.session_token");
        
        if (localUserStr && sessionToken) {
          try {
            const localUser = JSON.parse(localUserStr);
            console.log("[Auth] Rehydrated user from local storage:", localUser.email);
            setUser(localUser);
            setSession({ token: sessionToken, userId: localUser.id });
            
            const localJwt = localStorage.getItem("better-auth.jwt");
            if (localJwt) setToken(localJwt);
          } catch (e) {
            console.error("[Auth] Rehydration failed:", e);
            setUser(null);
            setSession(null);
          }
        } else {
          console.log("[Auth] Guest mode active.");
          setUser(null);
          setSession(null);
          setToken(null);
        }
      }
    } catch (error) {
      console.error("[Auth] Session fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    console.log("[Auth] Logging out...");
    try {
      await authClient.signOut();
    } catch (e) {
      console.warn("[Auth] Server sign-out error (expected in header-only mode):", e);
    } finally {
      // Nuking all local state and refreshing for a clean slate
      Object.keys(localStorage).forEach(key => {
        if (key.includes('better-auth')) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload();
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
