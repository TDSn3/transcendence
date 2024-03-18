import React from 'react';
import { IconoirProvider } from 'iconoir-react';

import './button-regular.css';

interface ButtonRegularSubmitProps {
  icon?: React.ElementType,
  text: string,
}

function ButtonRegularSubmit({
  icon: Icon,
  text,
}: ButtonRegularSubmitProps) {
  return (
    <button className="button-regular" type="submit">
      {
        Icon ? (
          <IconoirProvider
            iconProps={{
              strokeWidth: 1.75,
              width: '24px',
              height: '24px',
            }}
          >
            {React.createElement(Icon)}
          </IconoirProvider>
        ) : (
          <> </>
        )
      }
      <div className="button-regular-text">
        {text}
      </div>
    </button>
  );
}

ButtonRegularSubmit.defaultProps = {
  icon: null,
};

export default ButtonRegularSubmit;
