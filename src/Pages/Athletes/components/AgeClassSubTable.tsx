import React, { useState } from 'react';
import { AgeClassInterface, AthleteInterface } from '../../../Types/types';
import AgeClassRow from './AgeClassRow';
import CategorySubTable from './CategorySubTable';

export default function AgeClassSubTable(props: {
  ageClass: AgeClassInterface;
  athletes: {
    [categoryId: string]: AthleteInterface[];
  };
  updateAthleteFromTable: (newAthlete: AthleteInterface) => void;
  deleteAthleteFromTable: (athleteToDelete: AthleteInterface) => void;
  updateAgeClassFromTable: (newAgeClass: AgeClassInterface) => void;
}) {
  const { ageClass, athletes, updateAthleteFromTable, deleteAthleteFromTable, updateAgeClassFromTable } = props;
  const [opened, setOpened] = useState(!ageClass?.closed);

  /** get each Category of an AgeClass with its Athletes */
  function getTableCategories() {
    const tableElem: React.ReactNode[] = [];
    for (const category of ageClass.categories) {
      tableElem.push(
        <CategorySubTable
          category={category}
          athletes={athletes[category._id]}
          updateAthleteFromTable={updateAthleteFromTable}
          deleteAthleteFromTable={deleteAthleteFromTable}
          key={category._id}
        />
      );
    }
    return tableElem;
  }

  return (
    <>
      <AgeClassRow
        ageClass={ageClass}
        updateAgeClassFromTable={updateAgeClassFromTable}
        chevronFunction={() => setOpened((prev) => !prev)}
      />
      {opened && getTableCategories()}
    </>
  );
}
