import React from 'react';
import { createPortal } from 'react-dom';
import './modal.css';

export function Modal(props: {
  children: React.ReactNode;
  handleClose: () => void;
}) {
  const { handleClose, children } = props;

  const element = (
    <>
      <div className='overlay' />
      <div className='modal'>
        {children}
        <button className='close-button' onClick={() => handleClose()} />
      </div>
    </>
  );

  const portal_div = document.getElementById('portal')!;
  return createPortal(element, portal_div);
}
