import React from 'react';

export default function InputToggle(props: {
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { children, onChange } = props;
  return (
    <label className='timer-label'>
      <span className='input-description'>{children}</span>
      <div className='input-container'>
        <input type='checkbox' className='toggle-input' onChange={onChange} />
        <div className='toggle-fill' />
      </div>
    </label>
  );
}
