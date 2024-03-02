import {
  createContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import axios from 'axios';

import {
  UserStatus, User, emptyUser, AuthResponse,
} from '../../utils/types';

interface AuthContextType {
  isLoggedIn: boolean | null,
  user: User,
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>,
  setUser: React.Dispatch<React.SetStateAction<User>>,
}

const STORAGE_KEY = 'isLoggedIn';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// TODO: armoniser le back et front avec la db
const transformAuthResponseToUser = (authResponse: AuthResponse): User => ({
  id: '',
  createdAt: authResponse.created,
  updatedAt: -1, // TODO
  TwoFactorAuthSecret: authResponse.userData.TwoFactorAuthSecret,
  isTwoFactorEnabled: authResponse.userData.isTwoFactorEnabled,

  intraId: authResponse.userData.intraId,
  email42: authResponse.userData.email42,
  login: authResponse.userData.login,
  firstName: authResponse.userData.firstName,
  lastName: authResponse.userData.lastName,
  avatar: authResponse.userData.avatar,

  status: UserStatus.ONLINE, // TODO

  accessToken: authResponse.accessToken,
});

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
          const responseValue: AuthResponse = response.data.user;
          const userGoodData: User = transformAuthResponseToUser(responseValue);

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
