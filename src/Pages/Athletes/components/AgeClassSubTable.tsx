import React, { useState } from 'react';
import { AgeClassInterface, AthleteInterface } from '../../../Types/types';
import AgeClassRow from './AgeClassRow';
import CategorySubTable from './CategorySubTable';

export default function AgeClassSubTable(props: {
  ageClass: AgeClassInterface;
  athletes: {
    [categoryId: string]: AthleteInterface[];
  };
  modifyAgeClass: (ageClassId: string) => void;
  updateAthleteFromTable: (newAthlete: AthleteInterface) => void;
  deleteAthleteFromTable: (athleteToDelete: AthleteInterface) => void;
}) {
  const { ageClass, athletes, modifyAgeClass, updateAthleteFromTable, deleteAthleteFromTable } = props;
  const [opened, setOpened] = useState(true);

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
        modifyAgeClass={modifyAgeClass}
        chevronFunction={() => setOpened((prev) => !prev)}
      />
      {opened && getTableCategories()}
    </>
  );
}
