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
  modificationsDisabled: boolean
}) {
  const {
    category,
    athletes,
    updateAthleteFromTable,
    deleteAthleteFromTable,
    modificationsDisabled,
  } = props;
  const [opened, setOpened] = useState(true);

  /** get each Athlete of a Category */
  function getTableAthletes() {
    if (!athletes || athletes.length === 0) return <NoAthletesRow />;

    const tableElem: React.ReactNode[] = [];
    for (const athlete of athletes) {
      tableElem.push(
        <AthleteRow
          athlete={athlete}
          updateAthleteFromTable={updateAthleteFromTable}
          deleteAthleteFromTable={deleteAthleteFromTable}
          key={athlete._id}
          modificationsDisabled={modificationsDisabled}
        />
      );
    }

    return tableElem;
  }

  return (
    <>
      <CategoryRow
        category={category}
        openChevron={() => setOpened((prev) => !prev)}
        opened={opened}
      />
      {opened && getTableAthletes()}
    </>
  );
}
