import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat';
import Game from './components/Game/Game.js';
import SignIn42 from './components/Login/SignIn42.js';
import Logout from './components/Logout';

import { useAuth } from './components/Login/AuthContext';

import ChatRoutes from "./components/Chat/ChatRoutes.tsx";


function App() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="App container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signIn42" element={<SignIn42 />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="App container">
      <Navbar />
        <Routes>
			<Route path="/home" element={<Home />} />
			{/* <Route path="/profile" element={<Profile user={user} />} /> */}
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
