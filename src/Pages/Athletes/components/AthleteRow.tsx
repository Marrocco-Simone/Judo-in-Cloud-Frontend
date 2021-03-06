import React, { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { apiDelete, apiPut } from '../../../Services/Api/api';
import { AthleteInterface, AthleteParamsInterface } from '../../../Types/types';
import AthleteFormModal from './AthleteFormModal';

export default function AthleteRow(props: {
  athlete: AthleteInterface;
  updateAthleteFromTable: (newAthlete: AthleteInterface) => void;
  deleteAthleteFromTable: (athleteToDelete: AthleteInterface) => void;
  modificationsDisabled: boolean;
}) {
  const {
    athlete,
    updateAthleteFromTable,
    deleteAthleteFromTable,
    modificationsDisabled,
  } = props;
  const [isModifyAthleteOpen, setIsModifyAthleteOpen] = useState(false);

  return (
    <tr>
      <td className='table-column-15'>{athlete.name}</td>
      <td className='table-column-15'>{athlete.surname}</td>
      <td className='table-column-15'>{athlete.club}</td>
      <td className='table-column-15'>{athlete.birth_year}</td>
      <td className='table-column-15'>{athlete.weight}</td>
      <td className='table-column-15'>{athlete.gender}</td>
      <td className='table-column-10 centered-text'>
        <button
          className='icon-button orange'
          disabled={modificationsDisabled}
          onClick={() => setIsModifyAthleteOpen(true)}
        >
          <FaPen />
        </button>
        {isModifyAthleteOpen && (
          <AthleteFormModal
            handleClose={() => setIsModifyAthleteOpen(false)}
            updateAthleteFromTable={updateAthleteFromTable}
            apiSend={(params: AthleteParamsInterface) =>
              apiPut(`v2/athletes/${athlete._id}`, params).then(
                (newAthlete: AthleteInterface) => {
                  updateAthleteFromTable(newAthlete);
                  if (newAthlete.category !== athlete.category) {
                    deleteAthleteFromTable(athlete);
                  }
                }
              )
            }
            initialParams={{
              name: athlete.name,
              surname: athlete.surname,
              club: athlete.club,
              birth_year: athlete.birth_year,
              weight: athlete.weight,
              gender: athlete.gender,
            }}
          >
            Modifica Atleta
          </AthleteFormModal>
        )}
        <button
          className='icon-button orange'
          disabled={modificationsDisabled}
          onClick={() =>
            Swal.fire({
              title: 'Sei sicuro?',
              text: `Stai per eliminare l'atleta ${athlete.name} ${athlete.surname} della societa' ${athlete.club}`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: "Si', elimina",
              cancelButtonText: 'No, torna indietro',
            }).then((result) => {
              if (result.isConfirmed) {
                apiDelete(`v2/athletes/${athlete._id}`).then(
                  (deletedAthlete) => {
                    deleteAthleteFromTable(deletedAthlete);
                    Swal.fire(
                      'Cancellato',
                      `l'atleta ${deletedAthlete.name} ${deletedAthlete.surname} e' stato eliminato dal sistema`,
                      'success'
                    );
                  }
                );
              }
            })
          }
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
}
