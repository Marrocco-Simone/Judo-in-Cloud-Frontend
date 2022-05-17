import React, { FC } from 'react';

const Input: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
  return (
    <input className='w-full bg-transparent border rounded p-2'
      {...props}>
    </input>
  );
};

export default Input;
