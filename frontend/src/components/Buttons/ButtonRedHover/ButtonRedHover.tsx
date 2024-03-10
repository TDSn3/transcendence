import React from 'react';
import { IconoirProvider } from 'iconoir-react';

import './button-red-hover.css';

interface ButtonRedHoverProps {
  icon: React.ElementType,
  text: string,
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

function ButtonRedHover({ icon: Icon, text, handleClick }: ButtonRedHoverProps) {
  return (
    <button className="button-red-hover" type="button" aria-label="Delete this friend" onClick={handleClick}>
      <IconoirProvider
        iconProps={{
          strokeWidth: 1.75,
          width: '24px',
          height: '24px',
        }}
      >
        {React.createElement(Icon)}
      </IconoirProvider>
      <div className="button-red-hover-text">
        {text}
      </div>
    </button>
  );
}

export default ButtonRedHover;
