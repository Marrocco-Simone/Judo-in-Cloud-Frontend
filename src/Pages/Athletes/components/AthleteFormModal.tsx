import React from 'react';
import { AthleteInterface, AthleteParamsInterface } from '../../../Types/types';
import { Modal } from '../../MatchTimer/components/Modal';
import { apiPost } from '../../../Services/Api/api';
import AthleteForm from './AthleteForm';

export default function AthleteFormModal(props: {
  handleClose: () => void;
  updateAthleteToTable: (newAthlete: AthleteInterface) => void;
}) {
  const { handleClose, updateAthleteToTable } = props;

  return (
    <Modal handleClose={handleClose}>
      <div className='form-title'>Aggiungi Atleta</div>
      <AthleteForm
        handleClose={handleClose}
        updateAthleteToTable={updateAthleteToTable}
        apiSend={(params: AthleteParamsInterface) => apiPost('v1/athletes', params)}
      />
    </Modal>
  );
}
