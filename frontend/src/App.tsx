import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat';
import Game from './components/Game/Game';
import SignIn42 from './components/SignIn42/SignIn42';
import Logout from './components/Logout';

import useAuth from './contexts/Auth/useAuth';

import ChatRoutes from './components/Chat/ChatRoutes';

function App() {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    console.log('isLoggedIn === false'); // TODO: bug quand on refresh, ne devrais pas passer ici
    return (
      <div className="App container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signIn42" element={<SignIn42 />} />
          <Route path="/" element={<Navigate to="/login" />} />
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        </Routes>
      </div>
    );
  }
  return (
    <div className="App container">
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:login" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        {ChatRoutes()}
        <Route path="/game" element={<Game />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}

export default App;
