// signIn42.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import IntraUserData from './interface/intra-user-data';

function SignIn42(): React.FC {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoggedIn, setUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    // console.log('code:', code);

    if (!code) {
      setError('No authorization code found');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/signin42', {
          params: { code },
          withCredentials: true,
        });

        if (response.data.user && response.status === 200) {
          const userData: IntraUserData = response.data.user;

          console.log('User cookie:', userData.accessToken);
          setLoggedIn(true);
          setUser(userData);

          const nextLocation = '/home';
          navigate(nextLocation);
        } else if (response.status === 501) {
          setLoggedIn(false);
          setError('User not found');
        }
      } catch (error) {
        setLoggedIn(false);
        console.error('Error during signin42 request:', error);
      }
    };

    fetchData();
  }, [location.search, navigate, setLoggedIn, setUser]);

  return (
    <div>
      <h1>Signing in...</h1>
    </div>
  );
};

export default SignIn42;
