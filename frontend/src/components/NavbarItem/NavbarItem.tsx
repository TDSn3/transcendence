import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './navbar-item.css';

interface NavbarItemProps {
  text: string,
  to: string,
  navbarItemSelected: string,
  setNavbarItemSelected: React.Dispatch<React.SetStateAction<string>>,
  handleClick?: () => void,
}

const NavbarItem = ({ text, to, navbarItemSelected, setNavbarItemSelected, handleClick }: NavbarItemProps) =>
{
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === to) {
      setNavbarItemSelected(text);
    }
  }, [location, to, text, setNavbarItemSelected]);

  return (
    <div>
      <Link to={to}>
        <button className={navbarItemSelected === text ? 'clicked-item-style' : 'item-style'} onClick={handleClick} >
          {text}
        </button>
      </Link>
    </div>
  );
};

export default NavbarItem;
