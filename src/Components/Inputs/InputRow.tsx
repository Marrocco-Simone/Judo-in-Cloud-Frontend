import React from 'react';

export default function InputRow(props: {
  children: React.ReactNode;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: string;
  extraAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
  datalist?: string[];
}) {
  const { children, value, onChange, inputType, extraAttributes, datalist } =
    props;

  function getDatalist() {
    if (!datalist) return null;
    return (
      <datalist id='suggestion-list'>
        {datalist.map((text) => (
          <option key={text}>{text}</option>
        ))}
      </datalist>
    );
  }

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
          {...(datalist && { list: 'suggestion-list' })}
        />
        {getDatalist()}
      </div>
    </label>
  );
}
