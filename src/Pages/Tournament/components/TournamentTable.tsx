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
  function getTableElements() {
    const tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
    if (tournamentTableData.length === 0) {
      return <div className='table-empty'>Nessun Torneo Disponibile</div>;
    }
    for (const tour of tournamentTableData) {
      tableElem.push(
        <tr
          key={tour._id}
          className={activeTournament === tour._id ? 'active-row' : ''}
          onClick={() => setActiveTournament(tour._id)}
        >
          <td>{tour.ageClassName}</td>
          <td>{tour.weight}</td>
          <td>{tour.gender}</td>
        </tr>
      );
    }
    return tableElem;
  }

  return (
    <table className='table'>
      <thead>
        <th>{"Classe d'eta'"}</th>
        <th>Peso</th>
        <th>Sesso</th>
      </thead>
      <tbody>{getTableElements()}</tbody>
    </table>
  );
}
