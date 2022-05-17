import React, { FC } from 'react';
import './Buttons.css';
import { IButtonProps } from './IconButton';

const OutlinedButton: FC<IButtonProps> = ({ children, style, ...props }) => {
  style = style ?? 'primary';
  return (
    <button {...props} className={`${style} border rounded p-2`}>
      {children}
    </button>
  );
};

export default OutlinedButton;
