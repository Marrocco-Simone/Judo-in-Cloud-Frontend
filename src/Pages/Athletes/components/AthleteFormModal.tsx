import React from 'react';
import { AthleteInterface } from '../../../Types/types';
import { Modal } from '../../MatchTimer/components/Modal';
import AthleteForm from './AthleteForm';

export default function AthleteFormModal(props: {
  handleClose: () => void;
  addNewAthleteToTable: (newAthlete: AthleteInterface) => void;
}) {
  const { handleClose, addNewAthleteToTable } = props;

  return (
    <Modal handleClose={handleClose}>
      <div className='form-title'>Aggiungi Atleta</div>
      <AthleteForm
        handleClose={handleClose}
        addNewAthleteToTable={addNewAthleteToTable}
        initialParams={{
          name: null,
          surname: null,
          club: null,
          birth_year: null,
          weight: null,
          gender: null,
        }}
        url={'v1/athletes'}
      />
    </Modal>
  );
}
