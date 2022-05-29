import React, { FC, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PublicOutletContext } from './PublicShell';
import '../../Css/public.css';
import DropDown, { OptionInterface } from './components/DropDown';
import { TournamentInterface } from '../../Types/types';
import { apiGet } from '../../Services/Api/api';

const PublicTournaments: FC = () => {
  const { competition } = useOutletContext<PublicOutletContext>();
  const [tournaments, setTournaments] = useState<OptionInterface>([]);
  const [selectedTournament, setSelectedTournament] = useState('');

  /** get data of tournaments when opening the page */
  useEffect(() => {
    apiGet('v1/tournaments').then((tournamentData: TournamentInterface[]) =>
      setTournaments(
        tournamentData.map((tour) => {
          return {
            value: tour._id,
            name: `${tour.category.age_class.name} ${tour.category.max_weight} ${tour.category.gender}`,
          };
        })
      )
    );
  }, []);

  return (
    <div className='public-container'>
      <div className='competition-name'>{competition.name}</div>
      <DropDown
        options={tournaments}
        chooseOption={(optionValue: string) =>
          setSelectedTournament(optionValue)
        }
      >
        Scegli Categoria
      </DropDown>
      {selectedTournament}
    </div>
  );
};

export default PublicTournaments;
