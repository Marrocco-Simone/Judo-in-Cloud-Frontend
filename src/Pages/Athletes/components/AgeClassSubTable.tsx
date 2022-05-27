import React, { useState } from 'react';
import { FaChevronDown, FaCog } from 'react-icons/fa';
import { AgeClassInterface, AthleteInterface } from '../../../Types/types';
import CategorySubTable from './CategorySubTable';

export default function AgeClassSubTable(props: {
  ageClass: AgeClassInterface;
  athletes: {
    [categoryId: string]: AthleteInterface[];
  };
  modifyAgeClass: (ageClassId: string) => void;
}) {
  const { ageClass, athletes, modifyAgeClass } = props;
  const [opened, setOpened] = useState(true);

  /** get each Category of an AgeClass with its Athletes */
  function getTableCategories() {
    const tableElem: React.ReactNode[] = [];
    for (const category of ageClass.categories) {
      tableElem.push(
        <CategorySubTable
          category={category}
          athletes={athletes[category._id]}
        />
      );
    }
    return tableElem;
  }

  const ageClassRow = (
    <tr key={ageClass._id} className='age-class-row centered-text'>
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
          onClick={() => setOpened((prev) => !prev)}
        >
          <FaChevronDown />
        </button>
      </td>
    </tr>
  );

  return (
    <>
      {ageClassRow}
      {opened && getTableCategories()}
    </>
  );
}
