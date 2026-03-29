'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthUser {
  id: number;
  email: string;
  isAdmin?: boolean;
  role?: "employee" | "admin";
  name?: string;
  token?: string;

  todayRecords?: Array<{
    timein: string;
    timeout: string | null;
  }> | null;
  records?: Array<{
    timein: string;
    timeout: string | null;
  }> | null;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'employee' | 'admin') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  fetchUserDetails: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    console.log('Auth context - Logging out');
    setUser(null);
    localStorage.removeItem('auth-user');
    localStorage.removeItem('auth-token');
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const parsedToken = token ? JSON.parse(token) : null;
      if (!token) return false;
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${parsedToken.token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('auth-user', JSON.stringify(userData));
        return true;
      } else {
        console.log('Auth context - Invalid token, logging out');
        // logout();
         return false
      }
    } catch (error) {
      console.error('Fetch user details error:', error);
      logout();
      return false
    }
  };

  useEffect(() => {
    console.log('Auth context - useEffect running');
    const savedUser = localStorage.getItem('auth-user');
    const savedToken = localStorage.getItem('auth-token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Auth context - Setting user from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Auth context - Error parsing saved user:', error);
        localStorage.removeItem('auth-user');
        localStorage.removeItem('auth-token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.json();
        setUser(token);
        localStorage.setItem('auth-token', JSON.stringify(token));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'employee' | 'admin'): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      return response.ok;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, fetchUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};