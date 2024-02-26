import React from 'react';
import './login.css';
import Cta from '../Cta/cta';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login(): JSX.Element {
  const navigate = useNavigate();
  const { setLoggedIn, setUser } = useAuth();
  const handleClick42 = (event: React.FormEvent): void => {
    event.preventDefault();
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-84904227fc0a4c9b2bf80053ac3a28805d432b0970e0fa40c44ce8f1cb1f5403&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2FsignIn42&response_type=code';
  };

    const handleClick = async (event: React.FormEvent): Promise<void> => {
      event.preventDefault();
    
      const fakeUser = {
        code: 'fakeCode',
        otp: 'fakeOtp',
      };
    
      try {
        const response = await axios.post('http://localhost:5001/api/auth/FakeUsers', fakeUser, { withCredentials: true });
    
        if (response.status === 200) {
          const userData = response.data.user;
          setUser(userData);
          console.log('FakeUser data:', userData);
          setLoggedIn(true);
          const nextLocation = '/home';
          navigate(nextLocation);
        } else {
          console.error('Failed to create user:', response.data);
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }

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
