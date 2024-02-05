import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './button.css';

interface ButtonProps {
  text: string,
  to: string,
  buttonSelected: string,
  setButtonSelected: React.Dispatch<React.SetStateAction<string>>,
  handleClick?: () => void,
}

const Button = ({ text, to, buttonSelected, setButtonSelected, handleClick }: ButtonProps) =>
{
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === to) {
      setButtonSelected(text);
    }
  }, [location, to, text, setButtonSelected]);

  return (
    <div>
      <Link to={to}>
        <button className={buttonSelected === text ? 'clicked-button-style' : 'button-style'} onClick={handleClick} >
          {text}
        </button>
      </Link>
    </div>
  );
};

export default Button;
