import React from 'react';
import { TournamentTableData } from '../../../Types/types';

export default function TournamentTable({
  tournamentTableData,
  activeTournament,
  setActiveTournament,
}: {
  tournamentTableData: TournamentTableData[];
  activeTournament: string;
  setActiveTournament: (tournamentId: string) => void;
}) {
  function getRowClass(tour: TournamentTableData) {
    if (activeTournament === tour._id) return 'active-row';
    if (tour.finished) return 'finished-row';
    return '';
  }

  function getTableElements() {
    const tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
    if (tournamentTableData.length === 0) {
      return (
        <tr className='table-empty'>
          <td colSpan={3}>Nessun Torneo Disponibile</td>
        </tr>
      );
    }
    for (const tour of tournamentTableData) {
      tableElem.push(
        <tr
          key={tour._id}
          className={getRowClass(tour)}
          onClick={() => setActiveTournament(tour._id)}
        >
          <td className='table-column-50'>{tour.ageClassName}</td>
          <td className='table-column-25'>{tour.weight}</td>
          <td className='table-column-25'>{tour.gender}</td>
        </tr>
      );
    }
    return tableElem;
  }

  return (
    <table className='table'>
      <thead>
        <tr>
          <td className='table-column-50'>{"Classe d'eta'"}</td>
          <td className='table-column-25'>Peso</td>
          <td className='table-column-25'>Sesso</td>
        </tr>
      </thead>
      <tbody>{getTableElements()}</tbody>
    </table>
  );
}
