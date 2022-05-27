import React from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import { AthleteInterface } from '../../../Types/types';

export default function AthleteRow(props: { athlete: AthleteInterface }) {
  const { athlete } = props;
  return (
    <tr key={athlete._id}>
      <td className='table-column-15'>{athlete.name}</td>
      <td className='table-column-15'>{athlete.surname}</td>
      <td className='table-column-15'>{athlete.club}</td>
      <td className='table-column-15'>{athlete.birth_year}</td>
      <td className='table-column-15'>{athlete.weight}</td>
      <td className='table-column-15'>{athlete.gender}</td>
      <td className='table-column-10 centered-text'>
        <button className='icon-button orange'>
          <FaPen />
        </button>
        <button className='icon-button orange'>
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}
