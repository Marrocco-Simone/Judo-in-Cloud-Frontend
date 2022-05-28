import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { apiGet } from '../../Services/Api/api';
import { AgeClassInterface, AthleteInterface } from '../../Types/types';
import { Modal } from '../MatchTimer/components/Modal';
import AgeClassFormModal from './components/AgeClassFormModal';
import AthleteForm from './components/AthleteForm';
import AthleteTable from './components/AthleteTable';

export default function AthletesPage() {
  const [ageClasses, setAgeClasses] = useState<AgeClassInterface[]>([]);
  const [athletes, setAthletes] = useState<{
    [categoryId: string]: AthleteInterface[];
  }>({});
  const [isNewAthleteOpen, setIsNewAthleteOpen] = useState(false);
  const [modifyAgeClassOpen, setModifyAgeClassOpen] = useState('');

  /** get the age classes */
  useEffect(() => {
    apiGet('v1/age_classes').then((ageClassData: AgeClassInterface[]) => {
      setAgeClasses(ageClassData);
    });
  }, []);

  /**
   * get the athletes once gotten the age classes.
   * the athletes get then ordered in an object where each key is a category id
   * and every field is an array of the athletes of that category
   *
   * possible bug: when we update the age classes after the form submission
   * maybe the athletes are reloaded. It doesn't happen, but it's something
   * to look for
   * search setAgeClasses to know when this useEffect should be called
   */
  useEffect(() => {
    apiGet('v1/athletes').then((athleteData: AthleteInterface[]) => {
      const myAthletes: { [categoryId: string]: AthleteInterface[] } = {};
      for (const ageClass of ageClasses) {
        for (const cat of ageClass.categories) {
          const categoryId = cat._id;
          myAthletes[categoryId] = athleteData.filter(
            (ath) => ath.category === categoryId
          );
        }
      }
      setAthletes(myAthletes);
    });
  }, [ageClasses]);

  /** get the AgeClass that modifyAgeClassOpen is pointing at */
  const findFormAgeClass = () => {
    const ageClass = ageClasses.find((ac) => ac._id === modifyAgeClassOpen);
    if (!ageClass) throw new Error('age class not found'); // should never be here
    return ageClass;
  };

  /**
   * if the ageClass is closed, show an error swal
   * TODO: possibility of reopening an ageClass
   */
  useEffect(() => {
    if (!modifyAgeClassOpen) return;
    const ageClass = findFormAgeClass();
    if (!ageClass.closed) return;
    setModifyAgeClassOpen('');
    Swal.fire(
      "Classe gia' chiusa",
      "La classe e' gia' stata chiusa, non e' piu' possibile modificarla"
    );
  }, [modifyAgeClassOpen]);

  /**
   * return the modal to create a new Athlete
   * TODO: use the same modal for modifing an athlete
   */
  function getModalAthleteForm() {
    return (
      <Modal handleClose={() => setIsNewAthleteOpen(false)}>
        <div className='form-title'>Aggiungi Atleta</div>
        <AthleteForm
          handleClose={() => setIsNewAthleteOpen(false)}
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

  function addNewAthleteToTable(newAthlete: AthleteInterface) {
    setAthletes((prevAth) => {
      const categoryId = newAthlete.category;
      const newCategory = {
        [categoryId]: prevAth[categoryId],
      };
      newCategory[categoryId].push(newAthlete);
      return { ...prevAth, ...newCategory };
    });
  }

  function updateAgeClass(
    newParams: AgeClassInterface['params'],
    closed: boolean
  ) {
    setAgeClasses((prevAgeClasses) => {
      const newAgeClass = prevAgeClasses.find(
        (ageClass) => ageClass._id === modifyAgeClassOpen
      );
      if (!newAgeClass) throw new Error('age class not found'); // should never be here
      newAgeClass.params = newParams;
      newAgeClass.closed = closed;
      return prevAgeClasses;
    });
  }

  return (
    <div className='tournament-container'>
      <div className='search-athlete-container'></div>
      <AthleteTable
        ageClasses={ageClasses}
        athletes={athletes}
        modifyAgeClass={(ageClassId: string) =>
          setModifyAgeClassOpen(ageClassId)
        }
        openNewAthlete={() => setIsNewAthleteOpen(true)}
      />
      {isNewAthleteOpen && getModalAthleteForm()}
      {modifyAgeClassOpen !== '' && !findFormAgeClass().closed && (
        <AgeClassFormModal
          handleClose={() => setModifyAgeClassOpen('')}
          ageClass={findFormAgeClass()}
          updateAgeClass={updateAgeClass}
        />
      )}
    </div>
  );
}
