import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './button.css';

interface ButtonProps {
  text: string,
  to: string,
  buttonSelected: string,
  setButtonSelected: React.Dispatch<React.SetStateAction<string>>,
}

const Button = ({ text, to, buttonSelected, setButtonSelected }: ButtonProps) =>
{
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === to) {
      setButtonSelected(text);
    }
  }, [location, to, text, setButtonSelected]);

  return (
    <span style={{ margin: '8px' }}>
      <Link to={to}>
        <button className={buttonSelected === text ? 'clicked-button-style' : 'button-style'} >
          {text}
        </button>
      </Link>
    </span>
  );
};

export default Button;
