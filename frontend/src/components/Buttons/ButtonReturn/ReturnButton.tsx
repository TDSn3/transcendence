import { useNavigate } from 'react-router-dom';
import { ArrowLeft, IconoirProvider } from 'iconoir-react';

import './return-button.css';

interface ReturnButtonProps {
  path: string,
}

function ReturnButton({ path }: ReturnButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <button className="return-button" type="button" onClick={handleClick}>
      <IconoirProvider
        iconProps={{
          strokeWidth: 1.75,
          width: '24px',
          height: '24px',
        }}
      >
        <ArrowLeft />
      </IconoirProvider>
      <div className="return-button-text">
        Return
      </div>
    </button>
  );
}

export default ReturnButton;
