import React from 'react';
import './switch.css';
import cx from 'classnames';

interface SwitchProps {
  isToggled: boolean;
  onToggle: () => void;
  rounded?: boolean;
}

const Switch: React.FC<SwitchProps> = ({ isToggled, onToggle, rounded = false }) => {
  const sliderCX = cx('slider', {
    'toggled': isToggled,
    'rounded': rounded,
  });

  return (
    <div className="two_fa">
      2FA
      <label className="switch">
        <input type="checkbox" checked={isToggled} onChange={onToggle} />
        <span className={sliderCX}></span>
      </label>
    </div>
  );
};

export default Switch;
