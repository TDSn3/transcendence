import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../contexts/Auth/useAuth';
import authServices from '../services/auth';

function Logout() {
  const navigate = useNavigate();
  const { setLoggedIn, user } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await authServices.logoutUser(user);

        setLoggedIn(false);

        localStorage.removeItem('userLogin');

        navigate('/');
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Error during disconnection:', error);
        }
        navigate('/');
      }
    };

    performLogout();
  }, [navigate, setLoggedIn, user]);

  return (<> </>);
}

export default Logout;
