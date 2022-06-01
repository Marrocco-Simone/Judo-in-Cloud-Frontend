import React from 'react';

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
}) {
  const { clubAthletes } = props;

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
          /* className={getRowClass(tour)}
          onClick={() => setActiveTournament(tour._id)} */
        >
          <td className='table-column-40'>{`${athlete.name} ${athlete.surname}`}</td>
          <td className='table-column-40'>{athlete.tournament_name}</td>
          <td className='table-column-20'>{athlete.tournament_tatami}</td>
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
