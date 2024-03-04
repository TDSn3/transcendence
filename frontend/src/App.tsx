import { Route, Routes, Navigate } from 'react-router-dom';
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

function App() {
  const { isLoggedIn } = useAuth();

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
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </>
        )
      }
    </div>
  );
}

export default App;
