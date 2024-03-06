import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat/Chat';
import Game from './components/Game/Game';
import SignIn42 from './components/SignIn42/SignIn42';
import Logout from './components/Logout';
import Friends from './components/Friends/Friends';

import useAuth from './contexts/Auth/useAuth';

import ChatRoutes from './components/Chat/ChatRoutes';

import NotFoundPage from './components/NotFoundPage/NotFoundPage';

import { UserStatus, ServerToClientEvents, ClientToServerEvents } from './utils/types';

function App() {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      setSocket(io('http://localhost:5001/users/web-socket'));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (socket !== undefined) {
      socket.on('connect', () => {
        console.log('Web socket connected.');

        socket.emit('message', { id: user.id, status: UserStatus.ONLINE });
      });

      socket.on('disconnect', () => {
        console.log('Web socket disconnected.');
      });

      socket.on('message', (data) => {
        console.log('Message from web socket: ', data);
      });

      socket.on('clientOnline', (object) => {
        console.log('Message client online from web socket: ', object);
      });

      socket.on('clientOffline', (object) => {
        console.log('Message client offline from web socket: ', object);
      });

      return (() => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('message');
        socket.disconnect();
      });
    }

    return (() => {});
  }, [socket, user.id]);

  console.log('isLoggedIn === ', isLoggedIn);

  return (
    <div className="App container">
      {
        !isLoggedIn ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signIn42" element={<SignIn42 />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/profile/:login" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/chat" element={<Chat />} />
              {ChatRoutes()}
              <Route path="/game" element={<Game />} />
              <Route path="/logout" element={<Logout socket={socket} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </>
        )
      }
    </div>
  );
}

export default App;
