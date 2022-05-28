import React from 'react';
import { createPortal } from 'react-dom';

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

  const portalDiv = document.getElementById('portal')!;
  return createPortal(element, portalDiv);
}
