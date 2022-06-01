import React from 'react';
import { TournamentInterface } from '../../../Types/types';

export type ClubAthlete = {
  _id: string;
  name: string;
  surname: string;
  tournament_name: string;
  tournament_id?: string;
  tournament_tatami?: number;
};

export default function ClubAthleteTable(props: {
  clubAthletes: ClubAthlete[];
  tournaments: TournamentInterface[];
  activeAthlete: string;
  setActiveAthlete: (athleteId: string) => void;
}) {
  const { clubAthletes, activeAthlete, setActiveAthlete } = props;

  function getRowClass(athlete: ClubAthlete) {
    if (activeAthlete === athlete._id) return 'active-row';
    // if () return 'finished-row';
    return '';
  }

  function getTableElements() {
    const tableElem: React.ReactNode[] = [];
    if (clubAthletes.length === 0) {
      return (
        <tr className='table-empty'>
          <td colSpan={3}>Nessun Atleta da mostrare</td>
        </tr>
      );
    }
    for (const athlete of clubAthletes) {
      tableElem.push(
        <tr
          key={athlete._id}
          className={getRowClass(athlete)}
          onClick={() => setActiveAthlete(athlete._id)}
        >
          <td className='table-column-40'>{`${athlete.name} ${athlete.surname}`}</td>
          <td className='table-column-40'>{athlete.tournament_name}</td>
          <td className='table-column-20'>{athlete.tournament_id}</td>
        </tr>
      );
    }
    return tableElem;
  }

  return (
    <table className='table'>
      <thead>
        <tr>
          <td className='table-column-40'>Atleta</td>
          <td className='table-column-40'>Categoria</td>
          <td className='table-column-20'>Tatami</td>
        </tr>
      </thead>
      <tbody>{getTableElements()}</tbody>
    </table>
  );
}
