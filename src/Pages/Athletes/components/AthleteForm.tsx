import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { apiPost } from '../../../Services/Api/api';
import { AthleteInterface } from '../../../Types/types';

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

  function getInputRow(
    text: string,
    field: keyof typeof params,
    inputType: string,
    extraAttributes?: React.InputHTMLAttributes<HTMLInputElement>
  ) {
    return (
      <label className='timer-label' key={field}>
        <span className='input-description'>{text}</span>
        <div className='input-container'>
          <input
            type={inputType}
            className='athlete-input'
            value={params[field] || ''}
            onChange={(e) => {
              const updatedParam = { [field]: e.target.value };
              setParams((prevParams) => ({ ...prevParams, ...updatedParam }));
            }}
            {...extraAttributes}
          />
        </div>
      </label>
    );
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
      {getInputRow('Nome', 'name', 'text', { required: true })}
      {getInputRow('Cognome', 'surname', 'text', { required: true })}
      {getInputRow("Societa'", 'club', 'text', { required: true })}
      {getInputRow('Anno Nascita', 'birth_year', 'number', {
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
      })}
      {getInputRow('Peso', 'weight', 'number', {
        required: true,
        min: 1,
        max: 200,
      })}
      {getGenderRadio()}
      <button className='timer-button orange' type='submit' form='athlete-form'>
        Salva
      </button>
    </form>
  );
}
