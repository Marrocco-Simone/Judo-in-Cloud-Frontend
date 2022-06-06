import React, { ReactNode } from 'react';
import { TournamentTableData } from '../../../Types/types';

export default function TournamentTable(props: {
  tournamentTableData: TournamentTableData[];
  activeTournament: string;
  setActiveTournament: (tournamentId: string) => void;
  noResultsMessage: ReactNode;
}) {
  const { tournamentTableData, activeTournament, setActiveTournament, noResultsMessage } = props;

  function getRowClass(tour: TournamentTableData) {
    if (activeTournament === tour._id) return 'active-row';
    if (tour.finished) return 'finished-row';
    return '';
  }

  function getTableElements() {
    const tableElem: React.ReactNode[] = [];
    if (tournamentTableData.length === 0) {
      return (
        <tr className='table-empty'>
          <td colSpan={3}>{noResultsMessage}</td>
        </tr>
      );
    }
    for (const tour of tournamentTableData) {
      tableElem.push(
        <tr
          key={tour._id}
          className={`${getRowClass(tour)} cursor-pointer`}
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
          <td className='table-column-50'>{"Classe d'età"}</td>
          <td className='table-column-25'>Peso</td>
          <td className='table-column-25'>Sesso</td>
        </tr>
      </thead>
      <tbody>{getTableElements()}</tbody>
    </table>
  );
}
