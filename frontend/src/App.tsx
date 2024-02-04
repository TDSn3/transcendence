import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import Chat from './components/Chat';
import Game from './components/Game';

const App = () => {
  return (
    <div className="App">
      <h1>Transcendence</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      <Navbar/>
    </div>
  );
};

export default App;
