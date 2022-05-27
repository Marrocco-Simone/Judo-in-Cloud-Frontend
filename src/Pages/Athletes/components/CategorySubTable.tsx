import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { AthleteInterface, CategoryInterface } from '../../../Types/types';
import AthleteRow from './AthleteRow';

export default function CategorySubTable(props: {
  category: CategoryInterface;
  athletes: AthleteInterface[];
}) {
  const { category, athletes } = props;
  const [opened, setOpened] = useState(false);

  /** get each Athlete of a Category */
  function getTableAthletes() {
    if (athletes.length === 0) {
      const noAthletesRow = (
        <tr
          key={`no-athletes-${category._id}`}
          className='centered-text'
        >
          <td colSpan={5}>Nessun Atleta in questa categoria</td>
          <td className='table-column-10'></td>
        </tr>
      );
      return noAthletesRow;
    }

    const tableElem: React.ReactNode[] = [];
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

  if (!opened) return categoryRow;
  return (
    <>
      {categoryRow}
      {getTableAthletes()}
    </>
  );
}
