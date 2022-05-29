import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { CategoryInterface } from '../../../Types/types';

export default function CategoryRow(props: {
  category: CategoryInterface;
  chevronFunction: () => void;
}) {
  const { category, chevronFunction } = props;
  return (
    <tr className='category-row centered-text'>
      <td colSpan={5}>{`U${category.max_weight} ${category.gender}`}</td>
      <td className='table-column-10 centered-text'>
        <button className='icon-button orange' onClick={chevronFunction}>
          <FaChevronDown />
        </button>
      </td>
    </tr>
  );
}
