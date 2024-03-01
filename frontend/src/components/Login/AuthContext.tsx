import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntraUserData } from './interface/intra-user-data';
import axios from 'axios';

interface AuthContextType {
  isLoggedIn: boolean | null;
  user: IntraUserData | null;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
  setUser: React.Dispatch<React.SetStateAction<IntraUserData | null>>;
}

const STORAGE_KEY = 'isLoggedIn';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<IntraUserData | null>(null);

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

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
