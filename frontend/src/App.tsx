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

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUserList = async () => {
    const userList = await userService.getAll();
    setUsers(userList);
  };

  useEffect(() => {
    axios.get<undefined>(`${API_BASE_URL}/ping`);

    fetchUserList();
  }, []);

  return (
    // <div className="App container">
    //   {
    //     users.map((value) => (value.username))
    //   }
    // </div>
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
              <Route path="/profile" element={<Profile />} />
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
