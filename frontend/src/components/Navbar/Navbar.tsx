import { useState } from 'react';
import NavbarItem from './NavbarItem/NavbarItem';
import useAuth from '../../contexts/Auth/useAuth';
import './navbar.css';

function Navbar() {
  const [navbarItemSelected, setNavbarItemSelected] = useState<string>('');
  const { user } = useAuth();
  return (
    <div className="navbar-style">
      <div className="first-container-navbar">
        <NavbarItem
          to="/home"
          text="Home"
          navbarItemSelected={navbarItemSelected}
          setNavbarItemSelected={setNavbarItemSelected}
        />
        <NavbarItem
          to={`/profile/${user.login}`}
          text="Profile"
          navbarItemSelected={navbarItemSelected}
          setNavbarItemSelected={setNavbarItemSelected}
        />
        <NavbarItem
          to="/friends"
          text="Friends"
          navbarItemSelected={navbarItemSelected}
          setNavbarItemSelected={setNavbarItemSelected}
        />
        <NavbarItem
          to="/chat"
          text="Chat"
          navbarItemSelected={navbarItemSelected}
          setNavbarItemSelected={setNavbarItemSelected}
        />
        <NavbarItem
          to="/game"
          text="Play"
          navbarItemSelected={navbarItemSelected}
          setNavbarItemSelected={setNavbarItemSelected}
        />
      </div>
      <NavbarItem
        to="/logout"
        text="Logout"
        navbarItemSelected={navbarItemSelected}
        setNavbarItemSelected={setNavbarItemSelected}
      />
    </div>
  );
}

export default Navbar;
