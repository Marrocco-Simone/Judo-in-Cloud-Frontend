import React from 'react';
import { AgeClassInterface, AthleteInterface } from '../../../Types/types';
import OrangeButton from '../../Tournament/components/OrangeButton';
import AgeClassSubTable from './AgeClassSubTable';

export default function AthleteTable(props: {
  ageClasses: AgeClassInterface[];
  athletes: {
    [categoryId: string]: AthleteInterface[];
  };
  modifyAgeClass: (ageClassId: string) => void;
  openNewAthlete: () => void;
}) {
  const { ageClasses, athletes, modifyAgeClass, openNewAthlete } = props;

  /** get each AgeClass with its Categories and Athletes below */
  function getTableAgeClasses() {
    const tableElem: React.ReactNode[] = [];
    for (const ageClass of ageClasses) {
      tableElem.push(
        <AgeClassSubTable
          ageClass={ageClass}
          athletes={athletes}
          modifyAgeClass={() => modifyAgeClass(ageClass._id)}
          key={ageClass._id}
        />
      );
    }
    return tableElem;
  }

  return (
    <div className='table-container'>
      <div className='table-text'>
        Gestione Atleti
        <OrangeButton onClickFunction={() => openNewAthlete}>
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
