import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, emptyUser } from '../../utils/types';
import userServices from '../../services/user';

interface AuthContextType {
  isLoggedIn: boolean,
  user: User,
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<User>>,
  updateAuthStatus: () => void,
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode,
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== '/login') {
        const event = new CustomEvent('unauthorized');
        window.dispatchEvent(event);
      }
    }
    return Promise.reject(error);
  },
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const location = useLocation();
  const [user, setUser] = useState<User>({ ...emptyUser });
  const navigate = useNavigate();

  const hookIsLogged = () => {
    userServices
      .getUserByToken()
      .then((userValue) => {
        console.log('%cEnd auth context hook.', 'color: red;');

        setUser(userValue);
        setLoggedIn(true);
      })
      .catch((error) => {
        setLoggedIn(false);
        console.error(error);
      });
  };

  const updateAuthStatus = useCallback(() => {
    hookIsLogged();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [navigate, location.pathname]);

  useEffect(() => {
    console.log('location.pathname:', location.pathname);
    if (
      location.pathname !== '/login'
      && location.pathname !== '/login/twofa'
      && location.pathname !== '/signIn42'
      && location.pathname !== '/logout'
    ) {
      console.log('hookIsLogged', location.pathname);
      hookIsLogged();
    }
  }, [updateAuthStatus, location.pathname]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn,
      setLoggedIn,
      updateAuthStatus,
    }),
    [user, isLoggedIn, updateAuthStatus],
  );

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}

export default AuthContext;
