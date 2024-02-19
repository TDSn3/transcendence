import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat';
import Game from './components/Game';
import SignIn42 from './components/Login/signIn42';
import Logout from './components/Logout';

import { useAuth } from './components/Login/AuthContext';

import { User } from './utils/types';

import userService from './services/user';
import ChatRoutes from "./components/Chat/ChatRoutes.tsx";
import ChatRender from './components/Chat/Chatrender.tsx';

const defaultUser: User = {
  id: '',
  username: '',
  profilePictureUrl: '',
  rank: -1,
  gamesWon: -1,
  gamesLost: -1,
};

function App() {
  const { isLoggedIn } = useAuth();
  const [user, setUser] = useState<User>(defaultUser);

  const fetchUserList = async () => {
    const userList = await userService.getAll();
    setUser(userList[0]);
  };

  useEffect(() => {
    axios.get<undefined>(`${API_BASE_URL}/ping`);
    fetchUserList();
  }, []);

  // Si l'utilisateur n'est pas connecté, affichez la page de connexion
  if (!isLoggedIn) {
    console.log('isLoggedIn under login:', isLoggedIn);
    return (
      <div className="App container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signIn42" element={<SignIn42 />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  // Si l'utilisateur est connecté, affichez les autres pages
  return (
    console.log('isLoggedIn under navbar:', isLoggedIn),
    <div className="App container">
      <>
        <Navbar />
        <Routes>
			<Route path="/home" element={<Home />} />
			<Route path="/profile" element={<Profile user={user} />} />
			<Route path="/chat" element={<Chat />} />
			{ChatRoutes()}
			{/* <Route path="/chat/" element={<ChatRender channelName='kekw'/>} /> */}
			<Route path="/game" element={<Game />} />
			<Route path="/logout" element={<Logout />} />
			<Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </>
    </div>
  );
}

export default App;
