"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { userCheckAuth } from '@/apis/authApis';

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  phone: string | null;
  absenderEmail: string | null;
  bankName: string | null;
  bankNumber: string | null;
  busnessName: string | null;
  mainBusinessLocation: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  // Validate token on every route change (except login page)
  useEffect(() => {
    if (isInitialized && isAuthenticated && pathname !== '/login') {
      validateToken();
    }
  }, [pathname, isInitialized, isAuthenticated]);

  const validateToken = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');

    if (!token) {
      await forceLogout();
      return false;
    }

    try {
      const response = await userCheckAuth();

      if (response.success && response.user) {
        // Update user data in case it changed
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      } else {
        // Invalid token response
        await forceLogout();
        return false;
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      // Any error means invalid token
      await forceLogout();
      return false;
    }
  };

  const forceLogout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);

      // Only redirect if not already on login page
      if (pathname !== '/login') {
        router.push('/login');
      }
    } catch (error) {
      console.error('Force logout error:', error);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsInitialized(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await userCheckAuth();

      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        // Invalid token, clear it
        await forceLogout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid token
      await forceLogout();
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  const login = async (token: string) => {
    try {
      setIsLoading(true);
      // Store only the token
      localStorage.setItem('token', token);

      // Verify the token and get user data
      const response = await userCheckAuth();

      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Failed to verify authentication');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Clear token if verification fails
      localStorage.removeItem('token');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAuthenticated, isLoading, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}