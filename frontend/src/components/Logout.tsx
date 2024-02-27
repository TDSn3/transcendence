// Logout.tsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Login/AuthContext';

function Logout(): React.FC {
  const navigate = useNavigate();
  const { setLoggedIn, user, setUser} = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5001/api/auth/logout',
          { user },
          { withCredentials: true }, 
        );
  
        if (response.status !== 200) {
          throw new Error('Failed to log out');
        }
  
          setLoggedIn(false),
          localStorage.removeItem('isLoggedIn'),
          navigate('/login'),
          console.log('logoutuser: ', user)
       
      } catch (error) {
        console.error('Error during disconnection', error);
      }
    };
  
    performLogout();
  }, [navigate, setLoggedIn, setUser, user]);

  return <></>;
};

export default Logout;
