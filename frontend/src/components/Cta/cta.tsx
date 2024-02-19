import './cta.css';

interface ButtonProps {
  text: string,
  handleClick: (event: React.FormEvent) => void,
}

function Cta({ text, handleClick }: ButtonProps) {
  return (
    <div>
      <button className="cta-style" onClick={handleClick} type="button">
        <img height="18" src="../../42-BLACK.svg" alt={text} />
      </button>
    </div>
  );
}

export default Cta;
