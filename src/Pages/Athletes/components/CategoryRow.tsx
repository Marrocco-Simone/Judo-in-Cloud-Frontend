import React from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { CategoryInterface } from '../../../Types/types';

export default function CategoryRow(props: {
  category: CategoryInterface;
  openChevron: () => void;
  opened: boolean;
}) {
  const { category, openChevron, opened } = props;
  return (
    <tr className='category-row centered-text'>
      <td colSpan={5}>{`U${category.max_weight} ${category.gender}`}</td>
      <td className='table-column-10 centered-text'>
        <button className='icon-button orange' onClick={openChevron}>
        {(opened && <FaChevronDown />) || <FaChevronRight />}
        </button>
      </td>
    </tr>
  );
}
