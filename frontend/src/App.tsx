import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat';
import Game from './components/Game';

import { User } from './utils/types';

import userService from './services/user';

const defaultUser: User = {
  id: '',
  username: '',
  profilePictureUrl: '',
  rank: -1,
  gamesWon: -1,
  gamesLost: -1,
};

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User>(defaultUser);

  const fetchUserList = async () => {
    const userList = await userService.getAll();
    setUser(userList[0]);
  };

  useEffect(() => {
    axios.get<undefined>(`${API_BASE_URL}/ping`);
    fetchUserList();
  }, []);

  return (
    <div className="App container">
      {
        isLogin === false ? (
          <Routes>
            <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/game" element={<Game />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </>
        )
      }
    </div>
  );
}

export default App;
