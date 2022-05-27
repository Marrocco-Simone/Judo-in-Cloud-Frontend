import React, { useState } from 'react';
import { AthleteInterface, CategoryInterface } from '../../../Types/types';
import AthleteRow from './AthleteRow';
import CategoryRow from './CategoryRow';
import NoAthletesRow from './NoAthletesRow';

export default function CategorySubTable(props: {
  category: CategoryInterface;
  athletes: AthleteInterface[];
}) {
  const { category, athletes } = props;
  const [opened, setOpened] = useState(false);

  /** get each Athlete of a Category */
  function getTableAthletes() {
    if (athletes.length === 0) return <NoAthletesRow id={category._id} />;

    const tableElem: React.ReactNode[] = [];
    for (const athlete of athletes) {
      tableElem.push(<AthleteRow athlete={athlete} />);
    }

    return tableElem;
  }

  return (
    <>
      <CategoryRow
        category={category}
        onClick={() => setOpened((prev) => !prev)}
      />
      {opened && getTableAthletes()}
    </>
  );
}
