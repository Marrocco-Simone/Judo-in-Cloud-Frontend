import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { apiPost } from '../../../Services/Api/api';
import { AgeClassInterface } from '../../../Types/types';
import InputRow from '../../../Components/Inputs/InputRow';
import InputToggle from '../../../Components/Inputs/InputToggle';

export default function AgeClassForm(props: {
  handleClose: () => void;
  ageClass: AgeClassInterface;
  updateAgeClassFromTable: (newAgeClass: AgeClassInterface) => void;
}) {
  const { handleClose, ageClass, updateAgeClassFromTable } = props;
  const ageClassId = ageClass._id;
  const [params, setParams] = useState(ageClass.params);
  const [closed, setClosed] = useState(ageClass.closed);
  if (!ageClass) handleClose();

  function getOnChangeFunction(field: keyof typeof params) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setParams((prevParams) => ({
        ...prevParams,
        ...{ [field]: e.target.value },
      }));
  }

  return (
    <form
      id='athlete-form'
      onSubmit={(e) => {
        e.preventDefault();
        if (
          !params.match_time ||
          !params.ippon_timer ||
          !params.ippon_to_win ||
          !params.wazaari_timer ||
          !params.wazaari_to_win
        ) {
          return Swal.fire(
            'Completare tutti i campi',
            'Ad esclusione del campo <i>Tempo Golden Score</i>',
            'warning'
          );
        }
        apiPost(`v1/age_classes/${ageClassId}`, { closed, params }).then(
          (result: AgeClassInterface) => {
            result.categories = ageClass.categories;
            updateAgeClassFromTable(result);
            handleClose();
          }
        );
      }}
    >
      <InputRow
        value={params.match_time}
        onChange={getOnChangeFunction('match_time')}
        inputType={'number'}
      >
        {'Tempo Regolamentare'}
      </InputRow>
      <InputRow
        value={params.supplemental_match_time}
        onChange={getOnChangeFunction('supplemental_match_time')}
        inputType={'number'}
      >
        {'Tempo Golden Score'}
      </InputRow>
      (lasciare vuoto per golden score illimitato)
      <InputRow
        value={params.ippon_to_win}
        onChange={getOnChangeFunction('ippon_to_win')}
        inputType={'number'}
      >
        {'Ippon per Vincere'}
      </InputRow>
      <InputRow
        value={params.wazaari_to_win}
        onChange={getOnChangeFunction('wazaari_to_win')}
        inputType={'number'}
      >
        {'Waza Ari per Vincere'}
      </InputRow>
      <InputRow
        value={params.ippon_timer}
        onChange={getOnChangeFunction('ippon_timer')}
        inputType={'number'}
      >
        {'Timer Osaekomi Ippon'}
      </InputRow>
      <InputRow
        value={params.wazaari_timer}
        onChange={getOnChangeFunction('wazaari_timer')}
        inputType={'number'}
      >
        {'Timer Osaekomi Waza Ari'}
      </InputRow>
      <InputToggle
        checked={closed}
        onChange={() => {
          if (closed) return setClosed(false);

          Swal.fire({
            title: "Chiudere la classe d'eta'?",
            text: "Verrano creati gli incontri, ma non sara' piu' possibile inserire atleti di questa classe",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: "Si', chiudi la classe d'eta'",
            cancelButtonText: 'No, torna indietro ',
          }).then((result) => {
            if (result.isConfirmed) setClosed(true);
          });
        }}
      >
        {"Chiudere la classe d'eta'?"}
      </InputToggle>
      <button className='timer-button orange' type='submit' form='athlete-form'>
        Salva
      </button>
    </form>
  );
}
