// Logout.tsx
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Login/AuthContext';

function Logout(): React.FC {
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5001/api/auth/logout',
          { withCredentials: true }
        );
        console.log('response:', response);

        // Vérification du statut de la réponse
        if (response.status !== 200) {
          throw new Error('Failed to log out');
        }

        setLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
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
