import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cta from '../Cta/cta';
import useAuth from '../../contexts/Auth/useAuth';
import authServices from '../../services/auth';
import { UserStatus } from '../../utils/types';
import config from '../../utils/config';

import './login.css';

function Login() {
  const navigate = useNavigate();
  const { setUser, setLoggedIn } = useAuth();

  const handleClick42 = (event: React.FormEvent): void => {
    event.preventDefault();

    if (config.API_42_UID) {
      window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${config.API_42_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A${config.FRONTEND_PORT}%2FsignIn42&response_type=code`;
    } else {
      console.error('API 42 UID error. Needed on `.env.private` at root.');
    }
  };

  const handleClick = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    try {
      const user = await authServices.addFakeUser();

      setUser({ ...user, status: UserStatus.ONLINE });
      setLoggedIn(true);

      navigate(`/profile/${user.login}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error('Error creating user:', error);
      }
    }
  };

  return (
    <div className="login">
      <h3>Log in</h3>
      <Cta
        text="Authenticator"
        srcImg="../../42-BLACK.svg"
        altImg="Sign in with 42"
        handleClick={handleClick42}
      />
      <Cta text="Fake User" handleClick={handleClick} />
    </div>
  );
}

export default Login;
