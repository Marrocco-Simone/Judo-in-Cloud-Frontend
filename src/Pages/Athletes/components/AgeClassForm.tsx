import React, { useState } from 'react';
import { apiPost } from '../../../Services/Api/api';
import { AgeClassInterface } from '../../../Types/types';

export default function AgeClassForm(props: {
  handleClose: () => void;
  ageClass: AgeClassInterface;
  updateAgeClass: (
    newParams: AgeClassInterface['params'],
    closed: boolean
  ) => void;
}) {
  const { handleClose, ageClass, updateAgeClass } = props;
  const ageClassId = ageClass._id;
  const [params, setParams] = useState(ageClass.params);
  const [closed, setClosed] = useState(false);
  if (!ageClass) handleClose();

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

  function getCloseToggle() {
    return (
      <label className='timer-label'>
        <span className='input-description'>
          {"Chiudere la classe d'eta'?"}
        </span>
        <div className='input-container'>
          <input
            type='checkbox'
            className='toggle-input'
            onChange={(e) => setClosed(e.target.checked)}
          />
          <div className='toggle-fill' />
        </div>
      </label>
    );
  }

  return (
    <form
      id='athlete-form'
      onSubmit={(e) => {
        e.preventDefault();
        apiPost(`v1/age_classes/${ageClassId}`, { closed, params }).then(() => {
          updateAgeClass(params, closed);
          handleClose();
        });
      }}
    >
      {getInputRow('Tempo Regolamentare', 'match_time', 'number', {
        required: true,
      })}
      {getInputRow('Tempo Golden Score', 'supplemental_match_time', 'number')}
      (lasciare vuoto per golden score illimitato)
      {getInputRow('Ippon per Vincere', 'ippon_to_win', 'number', {
        required: true,
      })}
      {getInputRow('Waza Ari per Vincere', 'wazaari_to_win', 'number', {
        required: true,
      })}
      {getInputRow('Timer Osaekomi Ippon', 'ippon_timer', 'number', {
        required: true,
      })}
      {getInputRow('TImer Osaekomi Waza Ari', 'wazaari_timer', 'number', {
        required: true,
      })}
      {getCloseToggle()}
      <button className='timer-button orange' type='submit' form='athlete-form'>
        Salva
      </button>
    </form>
  );
}
