import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { AthleteInterface, AthleteParamsInterface } from '../../../Types/types';
import InputRow from './InputRow';
import TwoOptionRadio from './TwoOptionRadio';

export default function AthleteForm(props: {
  handleClose: () => void;
  updateAthleteFromTable: (newAthlete: AthleteInterface) => void;
  initialParams?: AthleteParamsInterface;
  apiSend: (params: AthleteParamsInterface) => Promise<any>;
}) {
  const { handleClose, updateAthleteFromTable, initialParams, apiSend } = props;
  const [params, setParams] = useState<AthleteParamsInterface>({
    name: initialParams?.name || '',
    surname: initialParams?.surname || '',
    club: initialParams?.club || '',
    birth_year: initialParams?.birth_year || '',
    weight: initialParams?.weight || '',
    gender: initialParams?.gender || '',
  });

  function getOnChangeFunction(field: keyof typeof params) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setParams((prevParams) => ({
        ...prevParams,
        ...{ [field]: `${e.target.value}` },
      }));
  }

  return (
    <form
      id='athlete-form'
      onSubmit={(e) => {
        e.preventDefault();
        if (
          !params.name ||
          !params.surname ||
          !params.club ||
          !params.birth_year ||
          !params.weight
        ) {
          return Swal.fire('Completare tutti i campi', '', 'warning');
        }
        if (!params.gender) {
          return Swal.fire("Scegliere il sesso dell'atleta", '', 'warning');
        }
        apiSend(params).then((athlete) => {
          updateAthleteFromTable(athlete);
          handleClose();
        });
      }}
    >
      <InputRow
        value={params.name}
        onChange={getOnChangeFunction('name')}
        inputType={'text'}
      >
        {'Nome'}
      </InputRow>
      <InputRow
        value={params.surname}
        onChange={getOnChangeFunction('surname')}
        inputType={'text'}
      >
        {'Cognome'}
      </InputRow>
      <InputRow
        value={params.club}
        onChange={getOnChangeFunction('club')}
        inputType={'text'}
      >
        {"Societa'"}
      </InputRow>
      <InputRow
        value={params.birth_year}
        onChange={getOnChangeFunction('birth_year')}
        inputType={'number'}
        extraAttributes={{
          min: 1900,
          max: new Date().getFullYear(),
        }}
      >
        {'Anno Nascita'}
      </InputRow>
      <InputRow
        value={params.weight}
        onChange={getOnChangeFunction('weight')}
        inputType={'number'}
        extraAttributes={{
          min: 1,
          max: 200,
        }}
      >
        {'Peso'}
      </InputRow>
      <TwoOptionRadio
        firstOption={'M'}
        secondOption={'F'}
        onChange={(option: string) => {
          if (option !== 'M' && option !== 'F') return;
          setParams((prevParams) => ({ ...prevParams, ...{ gender: option } }));
        }}
        value={params.gender}
      >
        Sesso
      </TwoOptionRadio>
      <button className='timer-button orange' type='submit' form='athlete-form'>
        Salva
      </button>
    </form>
  );
}
