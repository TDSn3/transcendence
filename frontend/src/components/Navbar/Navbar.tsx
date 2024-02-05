import { useState } from 'react';

import Button from '../Button/Button';
import './navbar.css';

const Navbar = () =>
{
  const [buttonSelected, setButtonSelected] = useState<string>('');

  return (
    <div className={'navbar-style'}>
      <Button to="/home" text='Home' buttonSelected={buttonSelected} setButtonSelected={setButtonSelected} />
      <Button to="/profile" text='Profile' buttonSelected={buttonSelected} setButtonSelected={setButtonSelected} />
      <Button to="/chat" text='Chat' buttonSelected={buttonSelected} setButtonSelected={setButtonSelected} />
      <Button to="/game" text='Play' buttonSelected={buttonSelected} setButtonSelected={setButtonSelected} />
    </div>
  );
};

export default Navbar;
