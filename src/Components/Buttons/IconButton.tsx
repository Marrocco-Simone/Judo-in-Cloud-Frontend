import React, { FC } from 'react';
import './Buttons.css';

export interface IButtonProps {
  onClick?: (event: React.MouseEvent) => void;
  style?: 'primary' | 'accent' | 'warn';
  type?: 'submit' | 'reset' | 'button';
  children?: React.ReactNode;
  disabled?: boolean;
}

const IconButton: FC<IButtonProps> = ({ children, style, ...props }) => {
  style = style ?? 'primary';
  return (
    <button {...props} className={`rounded-full p-2 ${style} filled mx-1`}>
      {children}
    </button>
  );
};

export default IconButton;
