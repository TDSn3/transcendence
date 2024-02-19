// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { IntraUserData } from './interface/intra-user-data';
import axios from 'axios';

interface AuthContextType {
  isLoggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<IntraUserData | null>>;
}

const STORAGE_KEY = 'isLoggedIn';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<IntraUserData | null>(null);

  // Vérifier si l'utilisateur est connecté lors du chargement initial
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/checksession', {
          withCredentials: true,
          });
        
        if (response.status === 200) {
          setLoggedIn(true);
        }
        else
          setLoggedIn(false);

      } catch (error) {
        console.error('Error checking session:', error);
        setLoggedIn(false);
      }
    }

    checkSession();
  }, [setLoggedIn]);

  // Mettre à jour le stockage local lorsqu'on change l'état d'authentification
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, setUser }}>
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
