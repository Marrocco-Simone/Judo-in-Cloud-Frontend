import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../../Services/Api/api';
import {
  AgeClassInterface,
  AthleteInterface,
  AthleteParamsInterface,
} from '../../Types/types';
import AthleteFormModal from './components/AthleteFormModal';
import AthleteTable from './components/AthleteTable';

export default function AthletesPage() {
  const [ageClasses, setAgeClasses] = useState<AgeClassInterface[]>([]);
  const [athletes, setAthletes] = useState<{
    [categoryId: string]: AthleteInterface[];
  }>({});
  const [isNewAthleteOpen, setIsNewAthleteOpen] = useState(false);

  /** get the age classes */
  useEffect(() => {
    apiGet('v1/age_classes').then((ageClassData: AgeClassInterface[]) => {
      setAgeClasses(ageClassData);
      apiGet('v1/athletes').then((athleteData: AthleteInterface[]) => {
        const myAthletes: { [categoryId: string]: AthleteInterface[] } = {};
        for (const ageClass of ageClassData) {
          for (const cat of ageClass.categories) {
            const categoryId = cat._id;
            myAthletes[categoryId] = athleteData.filter(
              (ath) => ath.category === categoryId
            );
          }
        }
        setAthletes(myAthletes);
      });
    });
  }, []);

  function updateAthleteFromTable(newAthlete: AthleteInterface) {
    if (!newAthlete) return;
    setAthletes((prevAth) => {
      const categoryId = newAthlete.category;
      const newCategory = {
        [categoryId]: prevAth[categoryId],
      };
      const athleteToUpdate = newCategory[categoryId].findIndex(
        (ath) => ath._id === newAthlete._id
      );
      if (athleteToUpdate < 0) newCategory[categoryId].push(newAthlete);
      else newCategory[categoryId][athleteToUpdate] = newAthlete;
      return { ...prevAth, ...newCategory };
    });
  }

  function deleteAthleteFromTable(athleteToDelete: AthleteInterface) {
    if (!athleteToDelete) return;
    setAthletes((prevAth) => {
      const categoryId = athleteToDelete.category;
      const newCategory = {
        [categoryId]: prevAth[categoryId],
      };
      newCategory[categoryId] = newCategory[categoryId].filter(
        (ath) => ath._id !== athleteToDelete._id
      );
      return { ...prevAth, ...newCategory };
    });
  }

  function updateAgeClassFromTable(newAgeClass: AgeClassInterface) {
    if (!newAgeClass) return;
    setAgeClasses((prevAgeClasses) => {
      const newAgeClasses: AgeClassInterface[] = [];
      for (const ageClass of prevAgeClasses) {
        if (ageClass._id === newAgeClass._id) newAgeClasses.push(newAgeClass);
        else newAgeClasses.push(ageClass);
      }
      return newAgeClasses;
    });
  }

  return (
    <div className='tournament-container'>
      <div className='search-athlete-container'></div>
      <AthleteTable
        ageClasses={ageClasses}
        athletes={athletes}
        openNewAthlete={() => setIsNewAthleteOpen(true)}
        updateAthleteFromTable={updateAthleteFromTable}
        deleteAthleteFromTable={deleteAthleteFromTable}
        updateAgeClassFromTable={updateAgeClassFromTable}
      />
      {isNewAthleteOpen && (
        <AthleteFormModal
          handleClose={() => setIsNewAthleteOpen(false)}
          updateAthleteFromTable={updateAthleteFromTable}
          apiSend={(params: AthleteParamsInterface) =>
            apiPost('v1/athletes', params)
          }
        >
          Aggiungi Atleta
        </AthleteFormModal>
      )}
    </div>
  );
}
