import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { User, emptyUser } from '../../utils/types';
import userServices from '../../services/user';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de login
      if (window.location.pathname !== '/login') {
        // Rediriger vers la page de login uniquement si l'utilisateur n'est pas déjà dessus
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const location = useLocation();
  const [user, setUser] = useState<User>({ ...emptyUser });

  const hookIsLogged = () => {
    const userLogin = localStorage.getItem('userLogin');
    console.log('userLogin:', userLogin);

    userServices
      .getUserByLogin()
      .then(({ user }) => {
        console.log('userValue:', user);
        setUser(user);
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
  };

  // Utilisez useCallback pour mémoriser updateAuthStatus
  const updateAuthStatus = useCallback(() => {
    hookIsLogged();
  }, []); // Ajoutez toutes les dépendances nécessaires dans ce tableau

  // Appellez hookIsLogged au montage du composant
  useEffect(() => {
    console.log('location.pathname:', location.pathname);
    if (
      location.pathname !== '/login' &&
      location.pathname !== '/login/twofa' &&
      location.pathname !== '/signIn42'
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
