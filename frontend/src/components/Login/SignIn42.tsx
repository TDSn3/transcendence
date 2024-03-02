// signIn42.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { User } from '../../utils/types';
import './signIn42.css';

function SignIn42(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoggedIn, setUser, user } = useAuth();
  const [errorSignIn, setErrorSignIn] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');

    if (!code) {
      setErrorSignIn('No authorization code found');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/signin42', {
          params: { code },
          withCredentials: true,
        });

        if (response.data.user && response.status === 200) {
          const userData: User = response.data.user;
          setUser(userData);
          setLoggedIn(true);
          const nextLocation = '/home';
          navigate(nextLocation);
        } else if (response.status === 501) {
          setLoggedIn(false);
          setErrorSignIn('User not found');
        }
      } catch (error) {
        setLoggedIn(false);
        console.error('Error during SignIn42 request:', error);
      }
    };

    fetchData();
  }, [location.search, navigate, setLoggedIn, setUser, user]);

  console.error('Error :', errorSignIn); // TODO: revoir le code de ce state

  return (
    <div className="loader-container" />
  );
}

export default SignIn42;
