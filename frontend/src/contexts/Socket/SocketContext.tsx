import {
  createContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { io, Socket } from 'socket.io-client';
import useAuth from '../Auth/useAuth';
import {
  UserStatus, ServerToClientEvents, ClientToServerEvents, UserForStatusWebSocket,
} from '../../utils/types';

interface SocketContextType {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined,
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode,
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { user, isLoggedIn } = useAuth();
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();

  const hookIsLoggedSetSocket = () => {
    if (isLoggedIn) {
      setSocket(io('http://localhost:5001/users/web-socket'));
    }
  };
  useEffect(hookIsLoggedSetSocket, [isLoggedIn]);

  const hookStartMessage = () => {
    if (socket !== undefined) {
      const handleConnect = () => {
        console.log('Web socket connected.');

        socket.emit('message', { id: user.id, status: UserStatus.ONLINE });
      };
      socket.on('connect', handleConnect);

      const handleDisconnect = () => {
        console.log('Web socket disconnected.');
      };
      socket.on('disconnect', handleDisconnect);

      const handleMessage = (data: UserForStatusWebSocket) => {
        console.log('Message from web socket: ', data);
      };
      socket.on('message', handleMessage);

      return (() => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('message', handleMessage);
        socket.disconnect();
      });
    }

    return (() => {});
  };
  useEffect(hookStartMessage, [socket, user.id]);

  const value = useMemo(() => ({
    socket,
  }), [socket]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContext;
