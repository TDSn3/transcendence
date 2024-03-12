import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import XmarkIconoirButtonOpacityOne from '../Buttons/XmarkIconoirButton/XmarkIconoirButtonOpacityOne';
import ButtonRegular from '../Buttons/ButtonRegular/ButtonRegular';

import './modal.css';

interface ModalProps {
  title: string,
  handleXmarkButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

function Modal({
  title,
  handleXmarkButtonClick,
  handleClick,
}: ModalProps) {
  const container = document.getElementById('before-root');

  const overlayDiv = (
    <>
      <div className="modal-box">
        <XmarkIconoirButtonOpacityOne handleClick={handleXmarkButtonClick} />
        <h3 style={{ margin: 0 }}>{title}</h3>
        <form className="form-style">
          <input className="input-modal" placeholder="https://www.exemple.com" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <ButtonRegular icon={null} text="OK" handleClick={handleClick} />
          </div>
        </form>
      </div>
      <div className="modal-background"> </div>
    </>
  );

  const hook = () => {
    const beforeRoot = document.getElementById('before-root');

    if (beforeRoot) beforeRoot.style.pointerEvents = 'auto';

    return (() => {
      if (beforeRoot) beforeRoot.style.pointerEvents = 'none';
    });
  };
  useEffect(hook, []);

  return (
    <>
      { ReactDOM.createPortal(overlayDiv, container as HTMLElement) }
    </>
  );
}

export default Modal;
