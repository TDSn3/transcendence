// signIn42.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../contexts/Auth/useAuth';
import authServices from '../../services/auth';

function SignIn42(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [errorSignIn, setErrorSignIn] = useState('');

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');

    if (!code) {
      setErrorSignIn('No authorization code found');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const user = await authServices.authentication42(code);
        setUser(user);
        if (user.isTwoFactorAuthEnabled) navigate('/login/twofa');
        else {
          console.log('User data:', user);
          navigate(`/profile/${user.login}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error('Error creating user:', error);
        }
      }
    };

    fetchData();
  }, [location.search, navigate, setUser]);

  if (errorSignIn !== '') {
    console.error('Error :', errorSignIn); // TODO: revoir le code de ce state
  }

  return <div> </div>;
}

export default SignIn42;
