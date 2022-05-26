import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaCog, FaPen, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { apiGet } from '../../Services/Api/api';
import {
  AgeClassInterface,
  AthleteInterface,
  CategoryInterface,
} from '../../Types/types';
import { Modal } from '../MatchTimer/components/Modal';
import AgeClassForm from './components/AgeClassForm';
import AthleteForm from './components/AthleteForm';

export default function AthletesPage() {
  const [ageClasses, setAgeClasses] = useState<AgeClassInterface[]>([]);
  const [athletes, setAthletes] = useState<{
    [categoryId: string]: AthleteInterface[];
  }>({});
  const [isNewAthleteOpen, setIsNewAthleteOpen] = useState(false);
  const [modifyAgeClassOpen, setModifyAgeClassOpen] = useState('');

  useEffect(() => {
    apiGet('v1/age_classes').then((ageClassData: AgeClassInterface[]) => {
      setAgeClasses(ageClassData);
    });
  }, []);

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

  function getTableAgeClasses() {
    let tableElem: React.ReactNode[] = [];
    for (const ageClass of ageClasses) {
      tableElem.push(
        <tr key={ageClass._id} className='age-class-row centered-text'>
          <td colSpan={5}>{ageClass.name}</td>
          <td className='table-column-10 centered-text'>
            <button
              className='icon-button orange'
              onClick={() => setModifyAgeClassOpen(ageClass._id)}
            >
              <FaCog />
            </button>
            <button className='icon-button orange'>
              <FaChevronDown />
            </button>
          </td>
        </tr>
      );
      tableElem = [...tableElem, ...getTableCategories(ageClass)];
    }
    return tableElem;
  }

  function getTableCategories(ageClass: AgeClassInterface) {
    let tableElem: React.ReactNode[] = [];
    for (const category of ageClass.categories) {
      tableElem.push(
        <tr key={category._id} className='category-row centered-text'>
          <td colSpan={5}>{`U${category.max_weight} ${category.gender}`}</td>
          <td className='table-column-10 centered-text'>
            <button className='icon-button orange'>
              <FaChevronDown />
            </button>
          </td>
        </tr>
      );
      tableElem = [...tableElem, ...getTableAthletes(category)];
    }
    return tableElem;
  }

  function getTableAthletes(category: CategoryInterface) {
    const tableElem: React.ReactNode[] = [];
    if (!athletes[category._id]) return [<></>];
    for (const athlete of athletes[category._id]) {
      tableElem.push(
        <tr key={athlete._id}>
          <td className='table-column-15'>{athlete.name}</td>
          <td className='table-column-15'>{athlete.surname}</td>
          <td className='table-column-15'>{athlete.club}</td>
          <td className='table-column-15'>{athlete.birth_year}</td>
          <td className='table-column-15'>{athlete.weight}</td>
          <td className='table-column-15'>{athlete.gender}</td>
          <td className='table-column-10 centered-text'>
            <button className='icon-button orange'>
              <FaPen />
            </button>
            <button className='icon-button orange'>
              <FaTrash />
            </button>
          </td>
        </tr>
      );
    }
    return tableElem;
  }
  const getAgeClassForForm = () => {
    const ageClass = ageClasses.find((ac) => ac._id === modifyAgeClassOpen);
    if (!ageClass) throw new Error('age class not found'); // should never be here
    return ageClass;
  };

  useEffect(() => {
    if (!modifyAgeClassOpen) return;
    const ageClass = getAgeClassForForm();
    if (!ageClass.closed) return;
    setModifyAgeClassOpen('');
    Swal.fire(
      "Classe gia' chiusa",
      "La classe e' gia' stata chiusa, non e' piu' possibile modificarla"
    );
  }, [modifyAgeClassOpen]);

  return (
    <div className='tournament-container'>
      <div className='search-athlete-container'></div>
      <div className='table-container'>
        <div className='table-text'>
          Gestione Atleti
          <button
            className='athlete-button orange'
            onClick={() => setIsNewAthleteOpen(true)}
          >
            Aggiungi Atleta
          </button>
        </div>
        <table className='table' id='athlete-table'>
          <thead>
            <tr>
              <td className='table-column-15'>Nome</td>
              <td className='table-column-15'>Cognome</td>
              <td className='table-column-15'>{"Societa'"}</td>
              <td className='table-column-15'>Anno Nascita</td>
              <td className='table-column-15'>Peso</td>
              <td className='table-column-15'>Sesso</td>
              <td className='table-column-10'></td>
            </tr>
          </thead>
          <tbody>{getTableAgeClasses()}</tbody>
        </table>
      </div>
      {isNewAthleteOpen && (
        <Modal handleClose={() => setIsNewAthleteOpen(false)}>
          <div className='form-title'>Aggiungi Atleta</div>
          <AthleteForm
            handleClose={() => setIsNewAthleteOpen(false)}
            addNewAthleteToTable={(newAthlete: AthleteInterface) =>
              setAthletes((prevAth) => {
                const categoryId = newAthlete.category;
                const newCategory = {
                  [categoryId]: prevAth[categoryId],
                };
                newCategory[categoryId].push(newAthlete);
                return { ...prevAth, ...newCategory };
              })
            }
            initialValues={{
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
      )}
      {modifyAgeClassOpen !== '' && !getAgeClassForForm().closed && (
        <Modal handleClose={() => setModifyAgeClassOpen('')}>
          <div className='form-title'>{"Impostazioni Classe d'eta'"}</div>
          <AgeClassForm
            handleClose={() => setModifyAgeClassOpen('')}
            ageClass={getAgeClassForForm()}
            updateAgeClass={(newParams: AgeClassInterface['params'], closed: boolean) =>
              setAgeClasses((prevAgeClasses) => {
                const newAgeClass = prevAgeClasses.find(
                  (ac) => ac._id === modifyAgeClassOpen
                );
                if (!newAgeClass) throw new Error('age class not found'); // should never be here
                newAgeClass.params = newParams;
                newAgeClass.closed = closed;
                return prevAgeClasses;
              })
            }
          />
        </Modal>
      )}
    </div>
  );
}
