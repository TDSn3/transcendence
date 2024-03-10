import React from 'react';
import { IconoirProvider } from 'iconoir-react';

import './button-regular.css';

interface ButtonRegularProps {
  icon: React.ElementType,
  text: string,
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

function ButtonRegular({ icon: Icon, text, handleClick }: ButtonRegularProps) {
  return (
    <button className="button-regular" type="button" aria-label="Delete this friend" onClick={handleClick}>
      <IconoirProvider
        iconProps={{
          strokeWidth: 1.75,
          width: '24px',
          height: '24px',
        }}
      >
        {React.createElement(Icon)}
      </IconoirProvider>
      <div className="button-regular-text">
        {text}
      </div>
    </button>
  );
}

export default ButtonRegular;
