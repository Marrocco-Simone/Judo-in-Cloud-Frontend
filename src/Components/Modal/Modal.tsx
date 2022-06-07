import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ThemeContext } from '../../Services/Theme/ThemeContext';

export function Modal(props: {
  children: React.ReactNode;
  handleClose: () => void;
}) {
  const { handleClose, children } = props;
  const { theme } = useContext(ThemeContext);

  const element = (
    <>
      <div className='overlay' />
      <div className={`modal-container ${theme === 'dark' ? 'dark' : ''}`}>
        <div className='modal'>
          {children}
          <button className='close-button' onClick={() => handleClose()} />
        </div>
      </div>
    </>
  );

  const portalDiv = document.getElementById('portal')!;
  return createPortal(element, portalDiv);
}
