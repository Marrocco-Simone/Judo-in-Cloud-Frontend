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
