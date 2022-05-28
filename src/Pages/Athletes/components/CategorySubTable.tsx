import React, { useState } from 'react';
import { AthleteInterface, CategoryInterface } from '../../../Types/types';
import AthleteRow from './AthleteRow';
import CategoryRow from './CategoryRow';
import NoAthletesRow from './NoAthletesRow';

export default function CategorySubTable(props: {
  category: CategoryInterface;
  athletes: AthleteInterface[];
  updateAthleteFromTable: (newAthlete: AthleteInterface) => void;
  deleteAthleteFromTable: (athleteToDelete: AthleteInterface) => void;
}) {
  const { category, athletes, updateAthleteFromTable, deleteAthleteFromTable } =
    props;
  const [opened, setOpened] = useState(false);

  /** get each Athlete of a Category */
  function getTableAthletes() {
    if (athletes.length === 0) return <NoAthletesRow />;

    const tableElem: React.ReactNode[] = [];
    for (const athlete of athletes) {
      tableElem.push(
        <AthleteRow
          athlete={athlete}
          updateAthleteFromTable={updateAthleteFromTable}
          deleteAthleteFromTable={deleteAthleteFromTable}
          key={athlete._id}
        />
      );
    }

    return tableElem;
  }

  return (
    <>
      <CategoryRow
        category={category}
        chevronFunction={() => setOpened((prev) => !prev)}
      />
      {opened && getTableAthletes()}
    </>
  );
}
