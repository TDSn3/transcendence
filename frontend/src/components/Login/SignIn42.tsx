// signIn42.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import IntraUserData from './interface/intra-user-data';
import './signIn42.css';

function SignIn42(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoggedIn, setUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');

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
          setUser(userData);
          setTimeout(() => {
            setLoggedIn(true);
            const nextLocation = '/home';
            navigate(nextLocation);

          }, 2000);
         
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
    <div className="loader-container"></div>
  );
}

export default SignIn42;
