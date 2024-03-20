import { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Channels from './components/Chat/Channels';
import Game from './components/Game/Game';
import SignIn42 from './components/SignIn42/SignIn42';
import Logout from './components/Logout';
import Friends from './components/Friends/Friends';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import useSocket from './contexts/Socket/useSocket';
import useAuth from './contexts/Auth/useAuth';
import TwoFaAuth from './components/2fa/2fa';
import ChatRoom from './components/Chat/ChatRoom';

function App() {
  const { socket } = useSocket();
  const { isLoggedIn } = useAuth();

  useEffect(() => console.log('isLoggedIn === ', isLoggedIn), [isLoggedIn]);

  return (
    <div className="App container">
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signIn42" element={<SignIn42 />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login/twofa" element={<TwoFaAuth />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/profile/:login" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/chat" element={<Channels />} />
            <Route path="/chat/:channelName" element={<ChatRoom />} />
            <Route path="/game" element={<Game />} />
            <Route path="/logout" element={<Logout socket={socket} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </>
      )}
    </div>
  );
}

export default App;
