import React, { useState } from 'react';

export default function DropDown(props: {
  children: React.ReactNode;
  options: { value: string; name: string }[];
  chooseOption: (optionValue: string) => void;
}) {
  const { children, options, chooseOption } = props;
  const [selected, setSelected] = useState('');

  function getOptions() {
    const optionElems: React.ReactNode[] = [];
    for (const option of options) {
      optionElems.push(
        <option value={option.value} key={option.value}>
          {option.name}
        </option>
      );
    }
    return optionElems;
  }

  return (
    <div>
      <label className='select-label'>
        {children}
        <select className='select' value={selected} onChange={(e) => {
          const newValue = e.target.value;
          setSelected(newValue);
          chooseOption(newValue);
        }}>
          <option className='void-option'>{children}</option>
          {getOptions()}
        </select>
      </label>
    </div>
  );
}
