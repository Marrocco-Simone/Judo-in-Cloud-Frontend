import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PublicOutletContext } from './PublicShell';
import '../../Css/public.css';
import DropDown, { OptionInterface } from './components/DropDown';
import { TournamentInterface } from '../../Types/types';
import { apiGet } from '../../Services/Api/api';
import OrangeButton from '../../Components/Buttons/OrangeButton';

const PublicTournaments: FC = () => {
  // for redirect
  const navigate = useNavigate();

  const { competition } = useOutletContext<PublicOutletContext>();
  const [tournaments, setTournaments] = useState<OptionInterface>([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [clubs, setClubs] = useState<OptionInterface>([]);
  const [selectedClub, setSelectedClub] = useState('');

  /** get data of tournaments when opening the page */
  useEffect(() => {
    apiGet(`v2/competitions/${competition._id}/tournaments`).then(
      (tournamentData: TournamentInterface[]) =>
        setTournaments(
          tournamentData.map((tour) => {
            return {
              value: tour._id,
              name: `${tour.category.age_class.name} ${tour.category.max_weight} ${tour.category.gender}`,
            };
          })
        )
    );
    apiGet('v1/athletes/club').then((clubArray: string[]) =>
      setClubs(
        clubArray.map((club) => {
          return { value: club, name: club };
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
      {selectedTournament && (
        <OrangeButton
          onClickFunction={() => navigate(`/tournament/${selectedTournament}`)}
        >
          Apri Tabellone
        </OrangeButton>
      )}
      <div className='competition-name'>Cerca i tuoi Atleti</div>
      <DropDown
        options={clubs}
        chooseOption={(optionValue: string) => setSelectedClub(optionValue)}
      >
        Scegli Club
      </DropDown>
      {selectedClub}
    </div>
  );
};

export default PublicTournaments;
