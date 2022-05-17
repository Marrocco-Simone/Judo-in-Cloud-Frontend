import React, { FC } from 'react';
import { IButtonProps } from './IconButton';

const LargeButton: FC<IButtonProps> = ({ children, style, ...props }) => {
  style = style ?? 'primary';
  return (
    <button {...props} className={`${style} border rounded p-10 w-full h-36 text-2xl`}>
      {children}
    </button>
  );
};

export default LargeButton;
