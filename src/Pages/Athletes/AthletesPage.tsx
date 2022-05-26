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
import OrangeButton from '../Tournament/components/OrangeButton';
import AgeClassForm from './components/AgeClassForm';
import AthleteForm from './components/AthleteForm';

export default function AthletesPage() {
  const [ageClasses, setAgeClasses] = useState<AgeClassInterface[]>([]);
  const [athletes, setAthletes] = useState<{
    [categoryId: string]: AthleteInterface[];
  }>({});
  const [isNewAthleteOpen, setIsNewAthleteOpen] = useState(false);
  const [modifyAgeClassOpen, setModifyAgeClassOpen] = useState('');
  /**
   * used to determine if a section is shown or not
   * id is either a ageClassId or a CategoryId
  */
  const [openedTable, setOpenedTable] = useState<{
    [id: string]: boolean;
  }>({});

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
    console.log('got athletes');
    apiGet('v1/athletes').then((athleteData: AthleteInterface[]) => {
      const myAthletes: { [categoryId: string]: AthleteInterface[] } = {};
      const newOpenedTable: { [id: string]: boolean } = {};
      for (const ageClass of ageClasses) {
        newOpenedTable[ageClass._id] = true;
        for (const cat of ageClass.categories) {
          const categoryId = cat._id;
          newOpenedTable[categoryId] = true;
          myAthletes[categoryId] = athleteData.filter(
            (ath) => ath.category === categoryId
          );
        }
      }
      setOpenedTable(newOpenedTable);
      setAthletes(myAthletes);
    });
  }, [ageClasses]);

  /** get each AgeClass with its Categories and Athletes below */
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
            <button
              className='icon-button orange'
              onClick={() =>
                setOpenedTable((prevOpTable) => {
                  return {
                    ...prevOpTable,
                    ...{ [ageClass._id]: !prevOpTable[ageClass._id] },
                  };
                })
              }
            >
              <FaChevronDown />
            </button>
          </td>
        </tr>
      );
      tableElem = [...tableElem, ...getTableCategories(ageClass)];
    }
    return tableElem;
  }

  /** get each Category of an AgeClass with its Athletes */
  function getTableCategories(ageClass: AgeClassInterface) {
    if (!openedTable[ageClass._id]) return [];
    let tableElem: React.ReactNode[] = [];
    for (const category of ageClass.categories) {
      tableElem.push(
        <tr key={category._id} className='category-row centered-text'>
          <td colSpan={5}>{`U${category.max_weight} ${category.gender}`}</td>
          <td className='table-column-10 centered-text'>
            <button
              className='icon-button orange'
              onClick={() =>
                setOpenedTable((prevOpTable) => {
                  return {
                    ...prevOpTable,
                    ...{ [category._id]: !prevOpTable[category._id] },
                  };
                })
              }
            >
              <FaChevronDown />
            </button>
          </td>
        </tr>
      );
      tableElem = [...tableElem, ...getTableAthletes(category)];
    }
    return tableElem;
  }

  /** get each Athlete of a Category */
  function getTableAthletes(category: CategoryInterface) {
    if (!openedTable[category._id]) return [];
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

  /** return the modal to modify parameters and close an AgeClass */
  function getModalAgeClassForm() {
    return (
      <Modal handleClose={() => setModifyAgeClassOpen('')}>
        <div className='form-title'>{"Impostazioni Classe d'eta'"}</div>
        <AgeClassForm
          handleClose={() => setModifyAgeClassOpen('')}
          ageClass={findFormAgeClass()}
          updateAgeClass={(
            newParams: AgeClassInterface['params'],
            closed: boolean
          ) =>
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
    );
  }

  return (
    <div className='tournament-container'>
      <div className='search-athlete-container'></div>
      <div className='table-container'>
        <div className='table-text'>
          Gestione Atleti
          <OrangeButton onClickFunction={() => setIsNewAthleteOpen(true)}>
            Aggiungi Atleta
          </OrangeButton>
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
      {isNewAthleteOpen && getModalAthleteForm()}
      {modifyAgeClassOpen !== '' &&
        !findFormAgeClass().closed &&
        getModalAgeClassForm()}
    </div>
  );
}
