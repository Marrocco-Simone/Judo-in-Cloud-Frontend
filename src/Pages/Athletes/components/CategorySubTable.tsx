import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { AthleteInterface, CategoryInterface } from '../../../Types/types';
import AthleteRow from './AthleteRow';

export default function CategorySubTable(props: {
  category: CategoryInterface;
  athletes: AthleteInterface[];
}) {
  const { category, athletes } = props;
  const [opened, setOpened] = useState(true);

  /** get each Athlete of a Category */
  function getTableAthletes() {
    const tableElem: React.ReactNode[] = [];
    if (!athletes) return [<></>];
    for (const athlete of athletes) {
      tableElem.push(<AthleteRow athlete={athlete} />);
    }
    return tableElem;
  }

  const categoryRow = (
    <tr key={category._id} className='category-row centered-text'>
      <td colSpan={5}>{`U${category.max_weight} ${category.gender}`}</td>
      <td className='table-column-10 centered-text'>
        <button
          className='icon-button orange'
          onClick={() => setOpened((prev) => !prev)}
        >
          <FaChevronDown />
        </button>
      </td>
    </tr>
  );

  let categorySubTable: React.ReactNode[] = [categoryRow];
  if (opened) categorySubTable = [...categorySubTable, ...getTableAthletes()];

  return <>{categorySubTable}</>;
}
