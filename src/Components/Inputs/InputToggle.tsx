import React from 'react';

export default function InputToggle(props: {
  children: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  const { children, checked, onChange } = props;
  return (
    <label className='timer-label'>
      <span className='input-description'>{children}</span>
      <div className='input-container'>
        <input
          type='checkbox'
          className='toggle-input'
          checked={checked}
          onChange={onChange}
        />
        <div className='toggle-fill' />
      </div>
    </label>
  );
}
