import React from 'react';
import { MatchTableData } from '../../../Types/types';

export default function MatchTable({
  matchTableData,
  activeMatch,
  setActiveMatch,
}: {
  matchTableData: MatchTableData[];
  activeMatch: string;
  setActiveMatch: (matchId: string) => void;
}) {
  function getRowClass(match: MatchTableData) {
    if (activeMatch === match._id) return 'active-row';
    if (match.isOver) return 'finished-row';
    if (match.isStarted) return 'warning-row';
    return '';
  }

  function getTableElements() {
    const tableElem: React.ReactNode[] = [];
    if (matchTableData.length === 0) {
      return (
        <tr className='table-empty'>
          <td colSpan={3}>Nessun Incontro Disponibile</td>
        </tr>
      );
    }
    for (const match of matchTableData) {
      tableElem.push(
        <tr
          key={match._id}
          className={getRowClass(match)}
          onClick={() => setActiveMatch(match._id)}
        >
          <td className={getWinner(match) === 'Bianco' ? 'table-column-40 bold-text' : 'table-column-40'}>{match.whiteAthlete}</td>
          <td className={getWinner(match) === 'Rosso' ? 'table-column-40 bold-text' : 'table-column-40'}>{match.redAthlete}</td>
          <td className='table-column-20'>{getWinner(match)}</td>
        </tr>
      );
    }
    return tableElem;
  }

  function getWinner(match: MatchTableData) {
    if (match.winnerAthlete === match.whiteAthlete) return 'Bianco';
    if (match.winnerAthlete === match.redAthlete) return 'Rosso';
    return '';
  }

  return (
    <table className='table'>
      <thead>
        <tr>
          <td className='table-column-40'>Atleta Bianco</td>
          <td className='table-column-40'>Atleta Rosso</td>
          <td className='table-column-20'>Vincitore</td>
        </tr>
      </thead>
      <tbody>{getTableElements()}</tbody>
    </table>
  );
}
