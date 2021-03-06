import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight, FaCog } from 'react-icons/fa';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { apiGet, apiPost } from '../../../Services/Api/api';
import { AgeClassInterface } from '../../../Types/types';
import AgeClassFormModal from './AgeClassFormModal';

export default function AgeClassRow(props: {
  ageClass: AgeClassInterface;
  updateAgeClassFromTable: (newAgeClass: AgeClassInterface) => void;
  openChevron: () => void;
  opened: boolean;
}) {
  const { ageClass, updateAgeClassFromTable, openChevron, opened } = props;
  const [isModifyAgeClassOpen, setIsModifyAgeClassOpen] = useState(false);

  async function reopenAgeClass() {
    const firstMessage: SweetAlertOptions<any, any> = {
      title: "Classe gia' chiusa",
      text: 'Vuoi riaprirla? I tornei e gli incontri esistenti verranno cancellati',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Si', resetta la classe d'eta'",
      cancelButtonText: 'No, torna indietro ',
    };

    const secondMessage: SweetAlertOptions<any, any> = {
      title: "Ci sono incontri Gia' disputati",
      text: 'Attenzione, continuando essi verranno eliminati',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Si', resetta la classe d'eta'",
      cancelButtonText: 'No, torna indietro ',
    };

    const firstResult = await Swal.fire(firstMessage);
    if (!firstResult.isConfirmed) return;

    const result: { can_reopen: boolean } = await apiGet(
      `v2/age_classes/reopen/${ageClass._id}`
    );
    if (!result.can_reopen) {
      const secondResult = await Swal.fire(secondMessage);
      if (!secondResult.isConfirmed) return;
    }

    apiPost(`v2/age_classes/reopen/${ageClass._id}`, {}).then(
      (result: AgeClassInterface) => {
        result.categories = ageClass.categories;
        updateAgeClassFromTable(result);
        Swal.fire(
          'Riaperta',
          "E' ora possibile aggiungere atleti o modificare i parametri di vittoria",
          'success'
        );
      }
    );
  }

  return (
    <tr className='age-class-row centered-text'>
      <td colSpan={5}>{ageClass.name}</td>
      <td className='table-column-10 centered-text'>
        <button
          className='icon-button orange'
          onClick={() => {
            if (ageClass.closed) return reopenAgeClass();
            else setIsModifyAgeClassOpen(true);
          }}
        >
          <FaCog />
        </button>
        {isModifyAgeClassOpen && (
          <AgeClassFormModal
            handleClose={() => setIsModifyAgeClassOpen(false)}
            ageClass={ageClass}
            updateAgeClassFromTable={updateAgeClassFromTable}
          />
        )}
        <button className='icon-button orange' onClick={openChevron}>
          {(opened && <FaChevronDown />) || <FaChevronRight />}
        </button>
      </td>
    </tr>
  );
}
