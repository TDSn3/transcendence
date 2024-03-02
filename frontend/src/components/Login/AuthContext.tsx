import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import axios from 'axios';

import { User } from '../../utils/types';

interface AuthContextType {
  isLoggedIn: boolean | null,
  user: User | null,
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
}

const STORAGE_KEY = 'isLoggedIn';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode,
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/me', {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(response.data.user);
          setLoggedIn(true);
        } else {
          setUser(null);
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoggedIn(false);
      }
    };

    checkSession();
  }, [setUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  const value = useMemo(() => ({
    isLoggedIn, setLoggedIn, user, setUser,
  }), [isLoggedIn, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
