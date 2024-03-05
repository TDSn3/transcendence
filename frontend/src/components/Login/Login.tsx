import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cta from '../Cta/cta';
import useAuth from '../../contexts/Auth/useAuth';
import authServices from '../../services/auth';

import './login.css';

function Login() {
  const navigate = useNavigate();
  const { setLoggedIn, setUser } = useAuth();

  const handleClick42 = (event: React.FormEvent): void => {
    event.preventDefault();

    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-84904227fc0a4c9b2bf80053ac3a28805d432b0970e0fa40c44ce8f1cb1f5403&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FsignIn42&response_type=code';
  };

  const handleClick = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    try {
      const user = await authServices.addFakeUser();

      setUser(user);
      setLoggedIn(true);

      localStorage.setItem('userLogin', user.login);

      navigate('/home');
    } catch (error: unknown) {
      setLoggedIn(false);

      localStorage.removeItem('userLogin');

      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Error creating user:', error);
      }
    }
  };

  return (
    <div className="login">
      <h3 style={{ marginBottom: '16px', marginLeft: 0 }}>Log in</h3>
      <Cta text="Sign in with 42" handleClick={handleClick42} />
      <h3 style={{ marginTop: '16px', marginLeft: 0 }}>Fake Users</h3>
      <Cta text="Sign in with Fake Users" handleClick={handleClick} />
    </div>
  );
}

export default Login;
