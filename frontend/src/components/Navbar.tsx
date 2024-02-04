import { useState } from 'react';

import Button from './Button/Button';

const Navbar = () =>
{
  const [buttonSelected, setButtonSelected] = useState<string>('');

  return (
    <div>
      <Button to="/" text='Home' buttonSelected={buttonSelected} setButtonSelected={setButtonSelected} />
      <Button to="/profile" text='Profile' buttonSelected={buttonSelected} setButtonSelected={setButtonSelected} />
      <Button to="/chat" text='Chat' buttonSelected={buttonSelected} setButtonSelected={setButtonSelected} />
      <Button to="/game" text='Play' buttonSelected={buttonSelected} setButtonSelected={setButtonSelected} />
    </div>
  );
};

export default Navbar;
