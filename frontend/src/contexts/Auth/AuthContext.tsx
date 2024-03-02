import {
  createContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import axios from 'axios';

import {
  User,
  emptyUser,
  AuthResponse,
  transformAuthResponseToUser,
} from '../../utils/types';

interface AuthContextType {
  isLoggedIn: boolean | null,
  user: User,
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>,
  setUser: React.Dispatch<React.SetStateAction<User>>,
}

const STORAGE_KEY = 'isLoggedIn';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode,
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<User>({ ...emptyUser });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/me', {
          withCredentials: true,
        });

        if (response.status === 200) {
          const userData: AuthResponse = response.data.user;
          const userGoodData: User = transformAuthResponseToUser(userData);

          setUser(userGoodData);
          setLoggedIn(true);
        } else {
          setUser({ ...emptyUser });
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

export default AuthContext;
