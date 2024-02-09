import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Game from './components/Game';
import Logout from './components/Logout';

const App = () => {
  const [isLogin, setIsLogin] = useState<boolean>(() => {
    const storedLogin = localStorage.getItem('isLogin');
    return storedLogin ? JSON.parse(storedLogin) : false;
  });

  useEffect(() => {
    localStorage.setItem('isLogin', JSON.stringify(isLogin));
    console.log('isLogin is on', isLogin);
  }, [isLogin]);
  
  return (
    <div className={'App container'}>
      {
        isLogin === false ? (
          <>
            <Routes>
              <Route path="/login" element={<Login setIsLogin={setIsLogin}/>} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </>
        ) : (
          <>
            <Navbar/>
            <Routes>
              <Route path="/home" element={<Home/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/chat" element={<Chat/>} />
              <Route path="/game" element={<Game/>} />
              <Route path="/logout" element={<Logout setIsLogin={setIsLogin}/>} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </>
        )
      }
    </div>
  );
};

export default App;
