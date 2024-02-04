import { Link } from 'react-router-dom';

interface ButtonProps {
  text: string,
  to: string,
}

const Button = ({ text, to }: ButtonProps) =>
{
  return (
    <Link to={to}>
      <button>
        {text}
      </button>
    </Link>
  );
};

export default Button;
