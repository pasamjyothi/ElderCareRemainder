import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Temporary in-memory storage
let memoryStorage: { [key: string]: string } = {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userData = memoryStorage['user'];
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Implement your login logic here
    const mockUser = { id: '1', name: 'Test User', email };
    memoryStorage['user'] = JSON.stringify(mockUser);
    setUser(mockUser);
  };

  const logout = async () => {
    delete memoryStorage['user'];
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    // Implement your registration logic here
    const mockUser = { id: '1', name, email };
    memoryStorage['user'] = JSON.stringify(mockUser);
    setUser(mockUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
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