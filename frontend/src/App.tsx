import { Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import LayoutWithNavbar from './components/LayoutWithNavbar';
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
import TwoFaAuth from './components/2fa/2fa';
import ChatRoom from './components/Chat/ChatRoom';

axios.defaults.withCredentials = true;

function App() {
  const { socket } = useSocket();

  return (
    <div className="App container">
      <Routes>
        <Route path="/" element={<LayoutWithNavbar />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="/profile/:login" element={<Profile />} />
          <Route path="friends" element={<Friends />} />
          <Route path="chat" element={<Channels />} />
          <Route path="chat/:channelName" element={<ChatRoom />} />
          <Route path="game" element={<Game />} />
          <Route path="logout" element={<Logout socket={socket} />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="login/twofa" element={<TwoFaAuth />} />
        <Route path="login" element={<Login />} />
        <Route path="signIn42" element={<SignIn42 />} />
      </Routes>
    </div>
  );
}

export default App;
