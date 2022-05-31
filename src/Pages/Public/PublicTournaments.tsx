import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PublicOutletContext } from './PublicShell';
import '../../Css/public.css';
import DropDown from './components/DropDown';
import { TournamentInterface } from '../../Types/types';
import { apiGet } from '../../Services/Api/api';
import OrangeButton from '../../Components/Buttons/OrangeButton';
import ClubAthleteTable from './components/ClubAthleteTable';

const PublicTournaments: FC = () => {
  // for redirect
  const navigate = useNavigate();

  const { competition } = useOutletContext<PublicOutletContext>();
  const [tournaments, setTournaments] = useState<TournamentInterface[]>([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [clubs, setClubs] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState('');

  /** get data of tournaments when opening the page */
  useEffect(() => {
    apiGet(`v2/competitions/${competition._id}/tournaments`).then(
      (tournamentData: TournamentInterface[]) => setTournaments(tournamentData)
    );
    apiGet('v1/athletes/club').then((clubData: string[]) => setClubs(clubData));
    console.table(tournaments);
  }, []);

  function getTournamentName(tour?: TournamentInterface) {
    if (!tour) return '';
    return `${tour.category.age_class.name} ${tour.category.max_weight} ${tour.category.gender}`;
  }

  return (
    <div className='public-container'>
      <div className='competition-name'>{competition.name}</div>
      <DropDown
        options={tournaments.map((tour) => {
          return {
            value: tour._id,
            name: getTournamentName(tour),
          };
        })}
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
        options={clubs.map((club) => {
          return { value: club, name: club };
        })}
        chooseOption={(optionValue: string) => setSelectedClub(optionValue)}
      >
        Scegli Club
      </DropDown>
      {selectedClub && (
        <ClubAthleteTable
          club={selectedClub}
          tournaments={tournaments}
          getTournamentName={getTournamentName}
        />
      )}
    </div>
  );
};

export default PublicTournaments;
