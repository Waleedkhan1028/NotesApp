"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`/api/auth/check?t=${Date.now()}`, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
          return true;
        }
      }
      
    
      setIsAuthenticated(false);
      setUser(null);
      
     
      if (pathname !== '/login' && pathname !== '/signup' && !pathname.startsWith('/public')) {
        router.push('/login');
      }
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      
      if (pathname !== '/login' && pathname !== '/signup' && !pathname.startsWith('/public')) {
        router.push('/login');
      }
      return false;
    }
  };

  useEffect(() => {

    checkAuth().finally(() => {
      setIsLoading(false);
    });


    const authInterval = setInterval(() => {
      checkAuth();
    }, 3000);

    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.includes('auth') || event.key?.includes('token')) {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(authInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, pathname]);

  const login = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    isLoading,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
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