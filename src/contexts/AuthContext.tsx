'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

// Define user type
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'USER';
  teacherId?: string;
};

// Define auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  mounted: boolean;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    setMounted(true);
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (error) {
            console.error('Failed to parse user data:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.auth.login(email, password);

      // Save token and user data to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      setUser(response.user);

      // Log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Login successful:', response.user);
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);

      // More detailed error in development
      if (process.env.NODE_ENV === 'development') {
        if (error instanceof Error) {
          setError(`Login failed: ${error.message}. Please check the console for more details.`);
        } else {
          setError('Login failed. Please check the console for more details.');
        }
      } else {
        setError(error instanceof Error ? error.message : 'Failed to login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.auth.register(userData);
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    setUser(null);
    router.push('/login');
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';

  // Context value
  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isTeacher,
    mounted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
