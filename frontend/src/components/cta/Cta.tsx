import './cta.css';

interface ButtonProps {
  text: string,
  handleClick: () => void,
}

const Cta = ({ text, handleClick }: ButtonProps) =>
{
  return (
    <div>
      <button className='cta-style' onClick={handleClick} >
        {text}
      </button>
    </div>
  );
};

export default Cta;
