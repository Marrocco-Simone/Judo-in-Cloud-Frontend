import React, { useState } from 'react';
import { AgeClassInterface, AthleteInterface, AthletesPerCategory } from '../../../Types/types';
import AgeClassRow from './AgeClassRow';
import CategorySubTable from './CategorySubTable';

export default function AgeClassSubTable(props: {
  ageClass: AgeClassInterface;
  athletes: AthletesPerCategory;
  updateAthleteFromTable: (newAthlete: AthleteInterface) => void;
  deleteAthleteFromTable: (athleteToDelete: AthleteInterface) => void;
  updateAgeClassFromTable: (newAgeClass: AgeClassInterface) => void;
}) {
  const { ageClass, athletes, updateAthleteFromTable, deleteAthleteFromTable, updateAgeClassFromTable } = props;
  const [opened, setOpened] = useState(!ageClass?.closed);

  /** get each Category of an AgeClass with its Athletes */
  function getTableCategories() {
    return ageClass.categories.map((category) => (
      <CategorySubTable
        category={category}
        athletes={athletes[category._id]}
        updateAthleteFromTable={updateAthleteFromTable}
        deleteAthleteFromTable={deleteAthleteFromTable}
        key={category._id}
        modificationsDisabled={ageClass.closed}
      />
    ));
  }

  return (
    <>
      <AgeClassRow
        ageClass={ageClass}
        updateAgeClassFromTable={updateAgeClassFromTable}
        openChevron={() => setOpened((prev) => !prev)}
        opened={opened}
      />
      {opened && getTableCategories()}
    </>
  );
}
