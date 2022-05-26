import React from 'react';

export default function InputRow(params: {
  children: React.ReactNode;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: string;
  extraAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const { children, value, onChange, inputType, extraAttributes } = params;

  return (
    <label className='timer-label'>
      <span className='input-description'>{children}</span>
      <div className='input-container'>
        <input
          type={inputType}
          className='athlete-input'
          value={value || ''}
          onChange={onChange}
          {...extraAttributes}
        />
      </div>
    </label>
  );
}
