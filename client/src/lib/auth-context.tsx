'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (data.session?.user) {
        setUser(data.session.user);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, _password: string): Promise<boolean> => {
    // For demo, accept any email with password "demo"
    if (_password === 'demo' || _password === 'Admin@123' || _password === 'User@123' || _password === 'Agent@123') {
      const mockUser = {
        id: 'user_' + Date.now(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'ADMIN' : email.includes('agent') ? 'AGENT' : 'USER',
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const signUp = async (name: string, email: string, _password: string): Promise<boolean> => {
    const newUser = {
      id: 'user_' + Date.now(),
      email,
      name,
      role: 'USER',
    };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const signOut = async () => {
    localStorage.removeItem('user');
    await fetch('/api/auth/session', { method: 'POST' });
    setUser(null);
  };

  const signInWithGoogle = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/api/auth/callback/google`;
    
    if (!clientId) {
      alert('Google OAuth not configured. Please add GOOGLE_CLIENT_ID to .env');
      return;
    }
    
    const scope = 'openid email profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
    
    window.location.href = authUrl;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}