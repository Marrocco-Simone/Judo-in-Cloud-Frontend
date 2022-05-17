import React, { FC } from 'react';

const CenteredBox: FC<any> = ({ children }) => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='border dark:border-neutral-400 p-10 rounded-2xl dark:bg-neutral-900 bg-neutral-100'>
        {children}
      </div>
    </div>
  );
};

export default CenteredBox;
