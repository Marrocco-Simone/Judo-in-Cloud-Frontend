import React, { FC } from 'react';

const Input: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
  return (
    <input className='w-full bg-white dark:bg-transparent border border-neutral-400 dark:border-neutral-500 rounded p-2'
      {...props}>
    </input>
  );
};

export default Input;
