import React from 'react';
import { FaChevronDown, FaCog } from 'react-icons/fa';
import { AgeClassInterface } from '../../../Types/types';

export default function AgeClassRow(props: {
  ageClass: AgeClassInterface;
  modifyAgeClass: (ageClassId: string) => void;
  chevronFunction: () => void;
}) {
  const { ageClass, modifyAgeClass, chevronFunction } = props;
  return (
    <tr className='age-class-row centered-text'>
      <td colSpan={5}>{ageClass.name}</td>
      <td className='table-column-10 centered-text'>
        <button
          className='icon-button orange'
          onClick={() => modifyAgeClass(ageClass._id)}
        >
          <FaCog />
        </button>
        <button
          className='icon-button orange'
          onClick={chevronFunction}
        >
          <FaChevronDown />
        </button>
      </td>
    </tr>
  );
}
