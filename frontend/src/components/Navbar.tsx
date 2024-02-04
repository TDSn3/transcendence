import Button from './Button/Button';

const Navbar = () =>
{
  return (
    <>
      <Button to="/" text='Home' />
      <Button to="/profile" text='Profile' />
      <Button to="/chat" text='Chat' />
      <Button to="/game" text='Play' />
    </>
  );
};

export default Navbar;
