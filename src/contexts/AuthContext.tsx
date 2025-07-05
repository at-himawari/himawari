import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('himawari-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsAuthenticated(true);
          localStorage.setItem('himawari-admin-auth', 'true');
          localStorage.setItem('himawari-admin-token', data.token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('himawari-admin-auth');
    localStorage.removeItem('himawari-admin-token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
