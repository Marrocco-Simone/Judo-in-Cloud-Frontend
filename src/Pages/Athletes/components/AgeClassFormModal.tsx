import React from 'react';
import { AgeClassInterface } from '../../../Types/types';
import { Modal } from '../../MatchTimer/components/Modal';
import AgeClassForm from './AgeClassForm';

export default function AgeClassFormModal(props: {
  handleClose: () => void;
  ageClass: AgeClassInterface;
  updateAgeClass: (newParams: AgeClassInterface['params'], closed: boolean) => void;
}) {
  const { handleClose, ageClass, updateAgeClass } = props;

  return (
    <Modal handleClose={() => handleClose()}>
      <div className='form-title'>{"Impostazioni Classe d'eta'"}</div>
      <AgeClassForm
        handleClose={() => handleClose()}
        ageClass={ageClass}
        updateAgeClass={updateAgeClass}
      />
    </Modal>
  );
}
