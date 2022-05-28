import React from 'react';

export default function OrangeButton(props: {
  children: React.ReactNode;
  onClickFunction: () => void;
}) {
  const { children, onClickFunction } = props;
  return (
    <button className='tournament-button orange' onClick={onClickFunction}>
      {children}
    </button>
  );
}
