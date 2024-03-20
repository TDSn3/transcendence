import {
  createContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

import { User, emptyUser } from '../../utils/types';
import userServices from '../../services/user';

interface AuthContextType {
  isLoggedIn: boolean,
  user: User,
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<User>>,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode,
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>({ ...emptyUser });

  const hookIsLogged = () => {
    const userLogin = localStorage.getItem('userLogin');
    console.log('userLogin: ', userLogin);
    if (userLogin && userLogin !== '') {
      console.log(userLogin, ' is already connected.');

      userServices
        .getUserByLogin(userLogin)
        .then((userValue) => {
          setUser(userValue);
          setLoggedIn(true);
        })
        .catch((error: unknown) => {
          console.error('Error getting user:', error);
          setLoggedIn(false);
          localStorage.removeItem('userLogin');
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error('Error creating user:', error);
          }
        });
    }
  };

  useEffect(hookIsLogged, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn,
      setLoggedIn,
    }),
    [user, isLoggedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
