import { IconoirProvider, Xmark } from 'iconoir-react';

import './xmark-iconoir-button.css';

interface XmarkIconoirButtonProps {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

function XmarkIconoirButton({ handleClick }: XmarkIconoirButtonProps) {
  return (
    <button className="xmark-iconoir-button" type="button" aria-label="Xmark button" onClick={handleClick}>
      <IconoirProvider
        iconProps={{
          strokeWidth: 1,
          width: '32px',
          height: '32px',
        }}
      >
        <Xmark />
      </IconoirProvider>
    </button>
  );
}

export default XmarkIconoirButton;
