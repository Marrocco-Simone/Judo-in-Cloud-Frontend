import React from 'react';

export default function DropDown(props: {
  children: React.ReactNode;
  options: { value: string; name: string }[];
  selectedOption: string;
  chooseOption: (optionValue: string) => void;
}) {
  const { children, options, selectedOption, chooseOption } = props;

  function getOptions() {
    return options.map((option) => (
      <option value={option.value} key={option.value}>
        {option.name}
      </option>
    ));
  }

  return (
    <div className='select-wrapper'>
      <label className='select-label'>
        {children}
        <select
          className='select'
          value={selectedOption}
          onChange={(e) => chooseOption(e.target.value)}
        >
          <option className='void-option'>{children}</option>
          {getOptions()}
        </select>
      </label>
    </div>
  );
}
