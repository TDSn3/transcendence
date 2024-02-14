// Logout.tsx
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Login/AuthContext';

function Logout(): React.FC {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.get('http://localhost:5001/api/auth/logout');
        console.log('User is disconnected');
        setLoggedIn(false);
        localStorage.removeItem('isLogin');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } catch (error) {
        console.error('Error during disconnection', error);
      }
    };

    performLogout();
  }, [navigate, setLoggedIn]);

  return <></>;
};

export default Logout;
