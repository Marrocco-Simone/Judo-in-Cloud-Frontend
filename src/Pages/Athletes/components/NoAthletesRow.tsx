import React from 'react';

export default function NoAthletesRow(props: { id: string }) {
  const { id } = props;
  return (
    <tr key={`no-athletes-${id}`} className='centered-text'>
      <td colSpan={5}>Nessun Atleta in questa categoria</td>
      <td className='table-column-10'></td>
    </tr>
  );
}
