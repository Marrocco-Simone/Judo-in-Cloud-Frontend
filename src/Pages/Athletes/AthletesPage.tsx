import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaCog, FaPen, FaTrash } from 'react-icons/fa';
import { apiGet } from '../../Services/Api/api';
import {
  AgeClassInterface,
  AthleteInterface,
  CategoryInterface,
} from '../../Types/types';

export default function AthletesPage() {
  const [ageClasses, setAgeClasses] = useState<AgeClassInterface[]>([]);
  const [athletes, setAthletes] = useState<{
    [categoryId: string]: AthleteInterface[];
  }>({});
  console.table(athletes);

  useEffect(() => {
    apiGet('v1/age_classes').then((ageClassData: AgeClassInterface[]) => {
      setAgeClasses(ageClassData);
    });
  }, []);

  useEffect(() => {
    apiGet('v1/athletes').then((athleteData: AthleteInterface[]) => {
      const myAthletes: { [categoryId: string]: AthleteInterface[] } = {};
      for (const ageClass of ageClasses) {
        for (const cat of ageClass.categories) {
          const categoryId = cat._id;
          myAthletes[categoryId] = athleteData.filter(
            (ath) => ath.category === categoryId
          );
        }
      }
      console.log(myAthletes);
      setAthletes(myAthletes);
    });
  }, [ageClasses]);

  function getTableAgeClasses() {
    let tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
    for (const ageClass of ageClasses) {
      tableElem.push(
        <tr key={ageClass._id} className='age-class-row centered-text'>
          <td colSpan={5}>{ageClass.name}</td>
          <td className='table-column-10 centered-text'>
            <button className='icon-button orange'>
              <FaCog />
            </button>
            <button className='icon-button orange'>
              <FaChevronDown />
            </button>
          </td>
        </tr>
      );
      tableElem = [...tableElem, ...getTableCategories(ageClass)];
    }
    return tableElem;
  }

  function getTableCategories(ageClass: AgeClassInterface) {
    let tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
    for (const category of ageClass.categories) {
      tableElem.push(
        <tr key={category._id} className='category-row centered-text'>
          <td colSpan={5}>{`U${category.max_weight} ${category.gender}`}</td>
          <td className='table-column-10 centered-text'>
            <button className='icon-button orange'>
              <FaChevronDown />
            </button>
          </td>
        </tr>
      );
      tableElem = [...tableElem, ...getTableAthletes(ageClass, category)];
    }
    return tableElem;
  }

  function getTableAthletes(
    ageClass: AgeClassInterface,
    category: CategoryInterface
  ) {
    const tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
    if (!athletes[category._id]) return [<></>];
    for (const athlete of athletes[category._id]) {
      tableElem.push(
        <tr key={athlete._id}>
          <td className='table-column-15'>{athlete.name}</td>
          <td className='table-column-15'>{athlete.surname}</td>
          <td className='table-column-15'>{athlete.club}</td>
          <td className='table-column-15'>{athlete.birth_year}</td>
          <td className='table-column-15'>{athlete.weight}</td>
          <td className='table-column-15'>{athlete.gender}</td>
          <td className='table-column-10 centered-text'>
            <button className='icon-button orange'>
              <FaPen />
            </button>
            <button className='icon-button orange'>
              <FaTrash />
            </button>
          </td>
        </tr>
      );
    }
    return tableElem;
  }

  return (
    <div className='tournament-container'>
      <div className='search-athlete-container'></div>
      <div className='table-container'>
        <div className='table-text'>
          Gestione Atleti
          <button className='athlete-button orange'>Aggiungi Atleta</button>
        </div>
        <table className='table' id='athlete-table'>
          <thead>
            <tr>
              <td className='table-column-15'>Nome</td>
              <td className='table-column-15'>Cognome</td>
              <td className='table-column-15'>{"Societa'"}</td>
              <td className='table-column-15'>Anno Nascita</td>
              <td className='table-column-15'>Peso</td>
              <td className='table-column-15'>Sesso</td>
              <td className='table-column-10'></td>
            </tr>
          </thead>
          <tbody>{getTableAgeClasses()}</tbody>
        </table>
      </div>
    </div>
  );
}
