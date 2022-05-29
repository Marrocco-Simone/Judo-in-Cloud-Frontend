import React from 'react';
import { AthleteInterface, AthleteParamsInterface } from '../../../Types/types';
import { Modal } from '../../../Components/Modal/Modal';
import AthleteForm from './AthleteForm';

export default function AthleteFormModal(props: {
  children: React.ReactNode;
  handleClose: () => void;
  updateAthleteFromTable: (newAthlete: AthleteInterface) => void;
  apiSend: (params: AthleteParamsInterface) => Promise<any>;
  initialParams?: AthleteParamsInterface;
}) {
  const { children, handleClose, updateAthleteFromTable, apiSend, initialParams } = props;

  return (
    <Modal handleClose={handleClose}>
      <div className='form-title'>{children}</div>
      <AthleteForm
        handleClose={handleClose}
        updateAthleteFromTable={updateAthleteFromTable}
        apiSend={apiSend}
        initialParams={initialParams}
      />
    </Modal>
  );
}
