import React, { useState } from 'react';
import { apiPost } from '../../../Services/Api/api';
import { AthleteInterface } from '../../../Types/types';

export default function AthleteForm(props: {
  handleClose: () => void;
  addNewAthleteToTable: (newAthlete: AthleteInterface) => void;
  initialValues: {
    name: string;
    surname: string;
    club: string;
    birth_year: number;
    weight: number;
    gender: 'M' | 'F';
  };
  /* url verso cui fare post con i dati modificati di values */
  url: string;
}) {
  const {
    handleClose,
    addNewAthleteToTable,
    initialValues,
    url,
  } = props;
  const [values, setValues] = useState(initialValues);

  function getInputRow(
    text: string,
    field: keyof typeof values,
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
            value={values[field]}
            onChange={(e) => {
              const updatedValue = { [field]: e.target.value };
              setValues((prevValues) => ({ ...prevValues, ...updatedValue }));
            }}
            required
            {...extraAttributes}
          />
        </div>
      </label>
    );
  }

  function getGenderRadio(gender: 'M' | 'F') {
    return (
      <div key={`gender-${gender}`}>
        <input
          id={`gender-${gender}`}
          type='radio'
          className='radio-input'
          name='gender'
          onChange={() => {
            const updatedValue: { gender: 'M' | 'F' } = { gender };
            setValues((prevValues) => ({ ...prevValues, ...updatedValue }));
          }}
          required
        />
        <label className='timer-label radio-label' htmlFor={`gender-${gender}`}>
          {gender}
        </label>
      </div>
    );
  }

  return (
    <form
      id='new-athlete-form'
      onSubmit={(e) => {
        e.preventDefault();
        apiPost(url, values).then((athlete) => {
          addNewAthleteToTable(athlete);
          handleClose();
        });
      }}
    >
      {getInputRow('Nome', 'name', 'text')}
      {getInputRow('Cognome', 'surname', 'text')}
      {getInputRow("Societa'", 'club', 'text')}
      {getInputRow('Anno Nascita', 'birth_year', 'number', {
        min: 1900,
        max: new Date().getFullYear(),
      })}
      {getInputRow('Peso', 'weight', 'number', { min: 1, max: 200 })}
      <div className='select-gender'>
        {getGenderRadio('M')}
        {getGenderRadio('F')}
      </div>
      <button
        className='timer-button orange'
        type='submit'
        form='new-athlete-form'
      >
        Salva
      </button>
    </form>
  );
}
