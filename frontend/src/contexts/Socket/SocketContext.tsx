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
import config from '../../utils/config';

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
      setSocket(io(config.USERS_WEB_SOCKET_URL));
    }
  };
  useEffect(hookIsLoggedSetSocket, [isLoggedIn]);

  const hookStartMessage = () => {
    if (socket !== undefined) {
      const handleConnect = () => {
        console.log('%cWeb socket connected.', 'color: green;');

        socket.emit('message', { id: user.id, status: UserStatus.ONLINE });
      };
      socket.on('connect', handleConnect);

      const handleDisconnect = () => {
        console.log('%cWeb socket disconnected.', 'color: red;');
      };
      socket.on('disconnect', handleDisconnect);

      const handleMessage = (data: UserForStatusWebSocket) => {
        console.log('%cMessage from web socket: ', 'color: #3333FF;', data);
      };
      socket.on('message', handleMessage);

      const handleUpdateStatus = (data: UserForStatusWebSocket) => {
        console.log('%cNew status from web socket: ', 'color: #F3CC00;', data);
      };
      socket.on('updateStatus', handleUpdateStatus);

      return (() => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('message', handleMessage);
        socket.off('updateStatus', handleUpdateStatus);
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
