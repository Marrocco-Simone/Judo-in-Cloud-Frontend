import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PublicOutletContext } from './PublicShell';
import '../../Css/public.css';
import { AthleteInterface, TournamentInterface } from '../../Types/types';
import { apiGet } from '../../Services/Api/api';
import OrangeButton from '../../Components/Buttons/OrangeButton';
import ClubAthleteTable, { ClubAthlete } from './components/ClubAthleteTable';
import DropDown from '../../Components/Inputs/DropDown';

type AthleteData = AthleteInterface & { tournament: string };

export default function PublicTournaments() {
  // for redirect
  const navigate = useNavigate();

  const { competition } = useOutletContext<PublicOutletContext>();
  const [tournaments, setTournaments] = useState<TournamentInterface[]>([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [clubs, setClubs] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [clubAthletes, setClubAthletes] = useState<ClubAthlete[]>([]);
  const [activeAthlete, setActiveAthlete] = useState('');

  function getTournamentName(category?: TournamentInterface['category']) {
    if (!category) return '';
    return `${category.age_class.name} ${category.max_weight} ${category.gender}`;
  }

  /** get data of tournaments when opening the page */
  useEffect(() => {
    apiGet(`v2/competitions/${competition._id}/tournaments`).then(
      (tournamentData: TournamentInterface[]) => setTournaments(tournamentData)
    );
    apiGet('v2/athletes/club').then((clubData: string[]) => setClubs(clubData));
  }, []);

  function getClubAthletes(athletesData: AthleteData[]) {
    return athletesData.map((athlete: AthleteData) => {
      const tour = tournaments.find(
        (tournament) => tournament._id === athlete.tournament
      );
      return {
        _id: athlete._id,
        name: athlete.name,
        surname: athlete.surname,
        // @ts-ignore
        tournament_name: getTournamentName(athlete.category),
        tournament_id: tour?._id,
        tournament_tatami: tour?.tatami_number,
      };
    });
  }

  useEffect(() => {
    if (!selectedClub) return;
    apiGet(`v2/athletes/club/${selectedClub}`).then(
      (athletesData: AthleteData[]) =>
        setClubAthletes(getClubAthletes(athletesData))
    );
  }, [selectedClub]);

  useEffect(() => {
    if (!activeAthlete) return;
    const athlete = clubAthletes.find((ath) => ath._id === activeAthlete);
    if (!athlete) return;
    if (!athlete?.tournament_id) return;
    setSelectedTournament(athlete.tournament_id);
  }, [activeAthlete]);

  return (
    <div className='public-container'>
      <div className='competition-name'>{competition.name}</div>
      <DropDown
        options={tournaments.map((tour) => {
          return {
            value: tour._id,
            name: getTournamentName(tour?.category),
          };
        })}
        selectedOption={selectedTournament}
        chooseOption={(optionValue: string) =>
          setSelectedTournament(optionValue)
        }
      >
        Scegli Categoria
      </DropDown>
      {selectedTournament && (
        <OrangeButton
          onClickFunction={() => navigate(`${selectedTournament}`)}
        >
          Apri Tabellone
        </OrangeButton>
      )}
      <div className='competition-name'>Cerca i tuoi Atleti</div>
      <DropDown
        options={clubs.map((club) => {
          return { value: club, name: club };
        })}
        selectedOption={selectedClub}
        chooseOption={(optionValue: string) => setSelectedClub(optionValue)}
      >
        Scegli Club
      </DropDown>
      {selectedClub && (
        <ClubAthleteTable
          clubAthletes={clubAthletes}
          tournaments={tournaments}
          activeAthlete={activeAthlete}
          setActiveAthlete={setActiveAthlete}
        />
      )}
    </div>
  );
}
