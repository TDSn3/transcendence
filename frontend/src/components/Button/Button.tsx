import { Link } from 'react-router-dom';

import './button.css';

interface ButtonProps {
  text: string,
  to: string,
}

const Button = ({ text, to }: ButtonProps) =>
{
  return (
    <Link to={to}>
      <button className='button-style'>
        {text}
      </button>
    </Link>
  );
};

export default Button;
