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
      .then(({ user }) => {
        console.log('userValue:', user);
        setUser(user);
        setLoggedIn(true);
      })
      .catch((error: unknown) => {
        setLoggedIn(false);
        console.error('Error getting user:', error);
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Error creating user:', error);
        }
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

  // Appellez hookIsLogged au montage du composant
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
  }, [updateAuthStatus, location.pathname]); // Ici updateAuthStatus est stable et ne changera pas à chaque rendu

  // Maintenant, updateAuthStatus peut être incluse sans provoquer d'avertissement
  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoggedIn,
      setLoggedIn,
      updateAuthStatus, // updateAuthStatus est maintenant stable entre les rendus
    }),
    [user, isLoggedIn, updateAuthStatus], // Ajoutez updateAuthStatus ici pour refléter sa stabilité
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
