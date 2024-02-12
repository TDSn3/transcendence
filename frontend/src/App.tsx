import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Game from './components/Game';
import Logout from './components/Logout';

const App = () => {

  return (
    <div className={'App container'}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Navigate to="/login" replace />
          }
        />
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/game" element={<Game />} />
                {/* <Route path="/logout" element={<Logout />} /> */}
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
