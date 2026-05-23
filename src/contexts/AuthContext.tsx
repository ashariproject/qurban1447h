
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = "admin" | "shohibul" | "animal" | "packaging" | "distribution";

interface User {
  username: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const CREDENTIALS: Record<string, { password: string; role: Role; name: string }> = {
  admin: { password: 'admin123', role: 'admin', name: 'Administrator' },
  shohibul: { password: 'shohibul123', role: 'shohibul', name: 'Petugas Shohibul' },
  hewan: { password: 'hewan123', role: 'animal', name: 'Petugas Hewan' },
  pengemasan: { password: 'pengemasan123', role: 'packaging', name: 'Petugas Pengemasan' },
  distribusi: { password: 'distribusi123', role: 'distribution', name: 'Petugas Distribusi' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('qurban_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = CREDENTIALS[username.toLowerCase()];
    if (foundUser && foundUser.password === password) {
      const userData: User = {
        username,
        role: foundUser.role,
        name: foundUser.name,
      };
      setUser(userData);
      localStorage.setItem('qurban_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qurban_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
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
