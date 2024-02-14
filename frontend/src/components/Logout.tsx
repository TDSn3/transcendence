// Logout.tsx
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { AuthContext } from './Login/AuthContext'; // Assurez-vous d'importer correctement votre contexte
import { useAuth } from './Login/AuthContext';


const Logout: React.FC = () => {
  // const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { setLoggedIn } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axios.get('http://localhost:5001/api/auth/logout');
        // logout();
        console.log('User is disconnected');
        navigate('/login');
        setLoggedIn(false);
      } catch (error) {
        console.error('Error during disconnection', error);
      }
    };

    performLogout();
  }, [navigate]);

  return null;
};

export default Logout;
