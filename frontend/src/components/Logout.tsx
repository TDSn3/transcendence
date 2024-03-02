import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../contexts/Auth/useAuth';

function Logout() {
  const navigate = useNavigate();
  const { setLoggedIn, user } = useAuth();

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

        localStorage.removeItem('userLogin');
        setLoggedIn(false);
        navigate('/');
      } catch (error) {
        console.error('Error during disconnection', error);

        localStorage.removeItem('userLogin');
        setLoggedIn(false);
        navigate('/');
      }
    };

    performLogout();
  }, [navigate, setLoggedIn, user]);

  return (<> </>);
}

export default Logout;
