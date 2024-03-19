import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../utils/types';
import useAuth from '../contexts/Auth/useAuth';
import authServices from '../services/auth';

interface LogoutProps {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined,
}

function Logout({ socket }: LogoutProps) {
  const navigate = useNavigate();
  const { setLoggedIn, user } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await authServices.logoutUser(user);

        setLoggedIn(false);
        if (socket !== undefined) {
          socket.disconnect();
        }

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
  }, [navigate, setLoggedIn, socket, user]);

  return <> </>;
}

export default Logout;
