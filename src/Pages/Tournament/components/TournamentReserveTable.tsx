import React from 'react';
import { TournamentTableData } from '../../../Types/types';
/**
 * activeTournament should be nTatami
 * setActiveTournament should be the api to reserve a tournament
 * In the future, generic chooseComponent that has as props getRowClass and getTableElements
 * (or something similar)
*/
export default function TournamentReserveTable(props: {
  tournamentTableData: TournamentTableData[];
  activeTournament: string;
  setActiveTournament: (tournamentId: string) => void;
}) {
  const { tournamentTableData, activeTournament, setActiveTournament } = props;

  function getRowClass(tour: TournamentTableData) {
    if (activeTournament === `${tour.tatami_number}`) return 'active-row';
    if (tour.tatami_number > 0) return 'finished-row cursor-pointer';
    return 'cursor-pointer';
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
          <td className='table-column-50'>{"Classe d'età"}</td>
          <td className='table-column-25'>Peso</td>
          <td className='table-column-25'>Sesso</td>
        </tr>
      </thead>
      <tbody className='higher-table'>{getTableElements()}</tbody>
    </table>
  );
}
