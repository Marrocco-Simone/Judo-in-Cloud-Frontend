import React from 'react';
import { TournamentTableData } from '../../../Types/types';

export default function TournamentTable(props: {
  tournamentTableData: TournamentTableData[];
  activeTournament: string;
  setActiveTournament: (tournamentId: string) => void;
}) {
  const { tournamentTableData, activeTournament, setActiveTournament } = props;

  function getRowClass(tour: TournamentTableData) {
    if (activeTournament === tour._id) return 'active-row';
    if (tour.finished) return 'finished-row';
    return '';
  }

  function getTableElements() {
    if (tournamentTableData.length === 0) {
      return (
        <tr className='table-empty'>
          <td colSpan={3}>Nessun Torneo Disponibile</td>
        </tr>
      );
    }

    return tournamentTableData.map((tour) => (
      <tr
        key={tour._id}
        className={getRowClass(tour)}
        onClick={() => setActiveTournament(tour._id)}
      >
        <td className='table-column-50'>{tour.ageClassName}</td>
        <td className='table-column-25'>{tour.weight}</td>
        <td className='table-column-25'>{tour.gender}</td>
      </tr>
    ));
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
