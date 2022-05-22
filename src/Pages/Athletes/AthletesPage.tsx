import React, { useEffect, useState } from 'react';
import { apiGet } from '../../Services/Api/api';
import {
  AgeClassInterface,
  AthleteInterface,
  /* CategoryInterface */
} from '../../Types/types';

export default function AthletesPage() {
  const [ageClasses, setAgeClasses] = useState<AgeClassInterface[]>([]);
  const [athletes, setAthletes] = useState<AthleteInterface[]>([]);
  console.table(athletes);

  useEffect(() => {
    apiGet('v1/athletes').then((athleteData) => {
      setAthletes(athleteData);
    });
    apiGet('v1/age_classes').then((ageClassData) => {
      setAgeClasses(ageClassData);
    });
  }, []);

  function getTableAgeClasses() {
    const tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
    for (const ageClass of ageClasses) {
      tableElem.push(
        <>
          <tr key={ageClass._id} className='age-class-row'>
            <td className='centered-text' colSpan={5}>
              {ageClass.name}
            </td>
            <td className='table-column-10'>icon</td>
          </tr>
          {getTableCategories(ageClass)}
        </>
      );
    }
    return tableElem;
  }

  function getTableCategories(ageClass: AgeClassInterface) {
    const tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
    for (const category of ageClass.categories) {
      tableElem.push(
        <>
          <tr key={category._id}>
            <td
              className='centered-text'
              colSpan={5}
            >{`U${category.max_weight} ${category.gender}`}</td>
            <td className='table-column-10'>icon</td>
          </tr>
          {/* getTableAthletes(ageClass, category) */}
        </>
      );
    }
    return tableElem;
  }

  /* function getTableAthletes(
    ageClass: AgeClassInterface,
    category: CategoryInterface
  ) {
    const tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
  } */

  return (
    <div className='tournament-container'>
      <div className='search-athlete-container'></div>
      <div className='table-container'>
        <div className='table-text'>Gestione Atleti</div>
        <table className='table' id='athlete-table'>
          <thead>
            <tr>
              <td className='table-column-15'>Nome</td>
              <td className='table-column-15'>Cognome</td>
              <td className='table-column-15'>{"Societa'"}</td>
              <td className='table-column-15'>Anno Nascita</td>
              <td className='table-column-15'>Peso</td>
              <td className='table-column-15'>Sesso</td>
              <td className='table-column-10'>Icon</td>
            </tr>
          </thead>
          <tbody>{getTableAgeClasses()}</tbody>
        </table>
      </div>
    </div>
  );
}
