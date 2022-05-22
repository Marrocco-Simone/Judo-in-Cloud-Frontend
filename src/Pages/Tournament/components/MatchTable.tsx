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
    const tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
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
          <td>{match.whiteAthlete}</td>
          <td>{match.redAthlete}</td>
          <td>{getWinner(match)}</td>
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
        <th>Atleta Bianco</th>
        <th>Atleta Rosso</th>
        <th>Vincitore</th>
      </thead>
      <tbody>{getTableElements()}</tbody>
    </table>
  );
}
