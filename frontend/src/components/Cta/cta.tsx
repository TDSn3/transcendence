import './cta.css';

interface ButtonProps {
  text?: string,
  srcImg?: string,
  altImg?: string,
  handleClick: (event: React.FormEvent) => void,
}

function Cta({
  text,
  srcImg,
  altImg,
  handleClick,
}: ButtonProps) {
  return (
    <div>
      <button className="cta-style" onClick={handleClick} type="button">
        { srcImg && (<img height="18" src={srcImg} alt={altImg} />) }
        { text && (text) }
      </button>
    </div>
  );
}

Cta.defaultProps = {
  text: null,
  srcImg: null,
  altImg: '',
};

export default Cta;
