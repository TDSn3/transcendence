import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// a refaire en fonction du cookie
interface LogoutProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Logout: React.FC<LogoutProps> = ({ setIsLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get('http://localhost:5001/api/auth/logout');
        setIsLogin(false);
        localStorage.removeItem('isLogin');
        console.log('User is disconnected');
        navigate('/login');
      } catch (error) {
        console.error('Error during disconnection', error);
      }
    };

    logout();
  }, [navigate, setIsLogin]);

  return null;
};

export default Logout;

