import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { apiPost } from '../../../Services/Api/api';
import { AthleteInterface } from '../../../Types/types';
import InputRow from './InputRow';

export default function AthleteForm(props: {
  handleClose: () => void;
  addNewAthleteToTable: (newAthlete: AthleteInterface) => void;
  initialParams: {
    name: string | null;
    surname: string | null;
    club: string | null;
    birth_year: number | null;
    weight: number | null;
    gender: 'M' | 'F' | null;
  };
  /* url verso cui fare post con i dati modificati di params */
  url: string;
}) {
  const { handleClose, addNewAthleteToTable, initialParams, url } = props;
  const [params, setParams] = useState(initialParams);

  function getOnChangeFunction(field: keyof typeof params) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setParams((prevParams) => ({
        ...prevParams,
        ...{ [field]: e.target.value },
      }));
  }

  function getGenderRadio() {
    return (
      <div className='select-gender'>
        <div className='gender-text'>Sesso</div>
        <input
          id={'gender-M'}
          type='radio'
          className='radio-input'
          name='gender'
          onChange={() => {
            const updatedParam: { gender: 'M' | 'F' } = { gender: 'M' };
            setParams((prevParams) => ({ ...prevParams, ...updatedParam }));
          }}
        />
        <label className='timer-label radio-label' htmlFor={'gender-M'}>
          M
        </label>
        <input
          id={'gender-F'}
          type='radio'
          className='radio-input'
          name='gender'
          onChange={() => {
            const updatedParam: { gender: 'M' | 'F' } = { gender: 'F' };
            setParams((prevParams) => ({ ...prevParams, ...updatedParam }));
          }}
        />
        <label className='timer-label radio-label' htmlFor={'gender-F'}>
          F
        </label>
      </div>
    );
  }

  return (
    <form
      id='athlete-form'
      onSubmit={(e) => {
        e.preventDefault();
        if (!params.gender) return Swal.fire("Scegliere il sesso dell'atleta");
        apiPost(url, params).then((athlete) => {
          addNewAthleteToTable(athlete);
          handleClose();
        });
      }}
    >
      <InputRow
        value={params.name}
        onChange={getOnChangeFunction('name')}
        inputType={'text'}
        extraAttributes={{ required: true }}
      >
        {'Nome'}
      </InputRow>
      <InputRow
        value={params.surname}
        onChange={getOnChangeFunction('surname')}
        inputType={'text'}
        extraAttributes={{ required: true }}
      >
        {'Cognome'}
      </InputRow>
      <InputRow
        value={params.club}
        onChange={getOnChangeFunction('club')}
        inputType={'text'}
        extraAttributes={{ required: true }}
      >
        {"Societa'"}
      </InputRow>
      <InputRow
        value={params.birth_year}
        onChange={getOnChangeFunction('birth_year')}
        inputType={'number'}
        extraAttributes={{
          required: true,
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
          required: true,
          min: 1,
          max: 200,
        }}
      >
        {'Anno Nascita'}
      </InputRow>
      {getGenderRadio()}
      <button className='timer-button orange' type='submit' form='athlete-form'>
        Salva
      </button>
    </form>
  );
}
