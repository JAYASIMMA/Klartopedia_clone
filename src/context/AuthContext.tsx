import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser } from '../services/loginservices';
import { clearCache, setUserCache, getUserCache } from '../utils/cacheUtils';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (userData: AdminUser) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        const sessionExpiry = localStorage.getItem('sessionExpiry');

        if (storedUser && storedToken && sessionExpiry) {
          const expiryTime = parseInt(sessionExpiry);
          const currentTime = Date.now();

          // Check if session is still valid (24 hours)
          if (currentTime < expiryTime) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
          } else {
            // Session expired, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            localStorage.removeItem('sessionExpiry');
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('sessionExpiry');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: AdminUser) => {
    // Set session expiry to 24 hours from now
    const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
    
    // Store user data and session info
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', `token_${Date.now()}`); // Simple token for demo
    localStorage.setItem('sessionExpiry', expiryTime.toString());
    
    // Cache user data for faster access
    setUserCache('profile', userData, 24 * 60 * 60 * 1000); // 24 hours
    
    // Update state
    setUser(userData);
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionExpiry');
    
    // Clear all cached data
    clearCache();
    
    // Update state
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
