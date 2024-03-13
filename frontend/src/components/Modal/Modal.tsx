import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import XmarkIconoirButtonOpacityOne from '../Buttons/XmarkIconoirButton/XmarkIconoirButtonOpacityOne';
import ButtonRegularSubmit from '../Buttons/ButtonRegular/ButtonRegularSubmit';

import './modal.css';

interface ModalProps {
  title: string,
  handleOnSubmitForm: (event: React.SyntheticEvent) => void,
  formValue: string,
  HandleFormOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleXmarkButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

function Modal({
  title,
  handleOnSubmitForm,
  formValue,
  HandleFormOnChange,
  handleXmarkButtonClick,
}: ModalProps) {
  const container = document.getElementById('before-root');

  const overlayDiv = (
    <>
      <div className="modal-box">
        <XmarkIconoirButtonOpacityOne handleClick={handleXmarkButtonClick} />
        <h3 style={{ margin: 0 }}>{title}</h3>
        <form className="form-style" onSubmit={handleOnSubmitForm}>
          <input
            className="input-modal"
            value={formValue}
            onChange={HandleFormOnChange}
            placeholder="https://www.exemple.com"
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <ButtonRegularSubmit text="OK" />
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
