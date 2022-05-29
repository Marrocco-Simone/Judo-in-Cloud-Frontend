import React from 'react';
import { AgeClassInterface } from '../../../Types/types';
import { Modal } from '../../../Components/Modal/Modal';
import AgeClassForm from './AgeClassForm';

export default function AgeClassFormModal(props: {
  handleClose: () => void;
  ageClass: AgeClassInterface;
  updateAgeClassFromTable: (newAgeClass: AgeClassInterface) => void;
}) {
  const { handleClose, ageClass, updateAgeClassFromTable } = props;

  return (
    <Modal handleClose={() => handleClose()}>
      <div className='form-title'>{"Impostazioni Classe d'eta'"}</div>
      <AgeClassForm
        handleClose={() => handleClose()}
        ageClass={ageClass}
        updateAgeClassFromTable={updateAgeClassFromTable}
      />
    </Modal>
  );
}
