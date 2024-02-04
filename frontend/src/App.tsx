import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Button from './components/Button';

const App = () => {
  return (
    <div className="App">
      <h1>Transcendence</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Button to="/" text='Home' />
      <Button to="/profile" text='Profile' />
    </div>
  );
};

export default App;
