import React from 'react';
import { MatchTableData } from '../../../Types/types';

export default function MatchTable({
  matchTableData
}: {
  matchTableData: MatchTableData[]
}) {
  function getTableElements() {
    const tableElem = [<div key='delete'></div>];
    tableElem.pop(); // only to get the right type of tableElem
    if (matchTableData.length === 0) {
      return <div className='table-empty'>Nessun Incontro Disponibile</div>;
    }
    for (const match of matchTableData) {
      tableElem.push(
        <tr key={match._id}>
          <td>{match.whiteAthlete}</td>
          <td>{match.redAthlete}</td>
          <td>icon</td>
        </tr>
      );
    }
    return tableElem;
  }

  return (
    <table className='table'>
      <thead>
        <th>Atleta Bianco</th>
        <th>Atleta Rosso</th>
        <th></th>
      </thead>
      <tbody>
        {getTableElements()}
      </tbody>
    </table>
  );
}
