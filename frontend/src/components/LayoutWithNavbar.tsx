import { Outlet } from 'react-router-dom';
import Navbar from './Navbar/Navbar';

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default LayoutWithNavbar;
