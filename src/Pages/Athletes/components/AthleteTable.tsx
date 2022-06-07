import React from 'react';
import {
  AgeClassInterface,
  AthleteInterface,
  AthletesPerCategory,
} from '../../../Types/types';
import OrangeButton from '../../../Components/Buttons/OrangeButton';
import AgeClassSubTable from './AgeClassSubTable';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

export default function AthleteTable(props: {
  ageClasses: AgeClassInterface[];
  athletes: AthletesPerCategory;
  openNewAthlete: () => void;
  updateAthleteFromTable: (newAthlete: AthleteInterface) => void;
  deleteAthleteFromTable: (athleteToDelete: AthleteInterface) => void;
  updateAgeClassFromTable: (newAgeClass: AgeClassInterface) => void;
}) {
  const {
    ageClasses,
    athletes,
    openNewAthlete,
    updateAthleteFromTable,
    deleteAthleteFromTable,
    updateAgeClassFromTable,
  } = props;

  /** get each AgeClass with its Categories and Athletes below */
  function getTableAgeClasses() {
    return ageClasses.map((ageClass) => (
      <AgeClassSubTable
        ageClass={ageClass}
        athletes={athletes}
        updateAthleteFromTable={updateAthleteFromTable}
        deleteAthleteFromTable={deleteAthleteFromTable}
        updateAgeClassFromTable={updateAgeClassFromTable}
        key={ageClass._id}
      />
    ));
  }

  return (
    <div className='table-container'>
      <div className='table-text'>
        <span className='flex items-center'>
          <NavLink to='/manage'>
            <FaArrowLeft className='mr-2' />
          </NavLink>
          Gestione Atleti
        </span>
        <OrangeButton onClickFunction={() => openNewAthlete()}>
          Aggiungi Atleta
        </OrangeButton>
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
  );
}
