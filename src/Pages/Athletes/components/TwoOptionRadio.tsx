import React from 'react';

export default function TwoOptionRadio(props: {
  children: React.ReactNode;
  firstOption: string;
  secondOption: string;
  onChange: (option: string) => void;
  value: string;
}) {
  const { children, firstOption, secondOption, onChange, value } = props;
  return (
    <div className='select-gender'>
      <div className='gender-text'>{children}</div>
      <input
        id={firstOption}
        type='radio'
        className='radio-input'
        name='gender'
        onChange={() => onChange(firstOption)}
        checked={value === firstOption}
      />
      <label className='timer-label radio-label' htmlFor={firstOption}>
        {firstOption}
      </label>
      <input
        id={secondOption}
        type='radio'
        className='radio-input'
        name='gender'
        onChange={() => onChange(secondOption)}
        checked={value === secondOption}
      />
      <label className='timer-label radio-label' htmlFor={secondOption}>
        {secondOption}
      </label>
    </div>
  );
}
