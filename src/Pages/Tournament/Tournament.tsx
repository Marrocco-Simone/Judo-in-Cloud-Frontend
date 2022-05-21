import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/tournament.css';
import TournamentTable from './components/TournamentTable';
import MatchTable from './components/MatchTable';
import { apiGet } from '../../Services/Api/api';
import { TournamentInterface, MatchInterface } from '../../Types/types';
import Swal from 'sweetalert2';

export default function Tournament() {
  // for redirect
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState<TournamentInterface[]>([]);
  const [matches, setMatches] = useState<MatchInterface[]>([]);

  useEffect(() => {
    apiGet('v1/tournaments').then((tournamentsData) => {
      setTournaments(tournamentsData);
    });
  }, []);

  function getTournamentsDataForTable() {
    const tournamentData: {
      _id: string;
      ageClassName: string;
      weight: string;
      gender: string;
      finished: boolean;
    }[] = [];
    for (const tour of tournaments) {
      tournamentData.push({
        _id: tour._id,
        ageClassName: tour.category.age_class.name,
        weight: `U${tour.category.max_weight}`,
        gender: tour.category.gender,
        finished: tour.finished,
      });
    }
    return tournamentData;
  }

  function getNextMatches(tournamentId: string) {
    /* apiGet(`v1/tournaments/${tournamentId}/next`).then((matchesData) => { */
    return apiGet(`v1/tournaments/${tournamentId}`).then((matchesData) => {
      setMatches(matchesData.winners_bracket[0]);
    });
  }

  function getMatchesDataForTable() {
    const matchesData: {
      _id: string;
      whiteAthlete: string;
      redAthlete: string;
      isStarted: boolean;
      isOver: boolean;
    }[] = [];
    for (const match of matches) {
      if (
        !match?.white_athlete?.surname ||
        !match?.white_athlete?.name ||
        !match?.red_athlete?.surname ||
        !match?.red_athlete?.name
      ) {
        continue;
      }
      matchesData.push({
        _id: match._id,
        whiteAthlete: `${match.white_athlete.surname} ${match.white_athlete.name}`,
        redAthlete: `${match.red_athlete.surname} ${match.red_athlete.name}`,
        isStarted: match.is_started,
        isOver: match.is_over,
      });
    }
    return matchesData;
  }

  return (
    <div className='tournament-grid-container'>
      <div className='n-tatami-container'>Tornei</div>
      <div className='blank-space'></div>
      <div className='table-text'>Categorie Prenotate</div>
      <div className='table-text'>Lista Incontri</div>
      <div className='table-container'>
        <TournamentTable />
      </div>
      <div className='table-container'>
        <MatchTable />
      </div>
      <button
        className='tournament-button orange'
        onClick={() => Swal.fire('Coming Soon')}
      >
        Prenota Categorie - Coming Soon
      </button>
      <button
        className='tournament-button orange'
        onClick={
          () => navigate('/errorpage') /* dovra' portare al torneo scelto */
        }
      >
        Apri Tabellone
      </button>
      <button
        className='tournament-button orange'
        onClick={() => navigate('/match-timer')}
      >
        Incontro Amichevole
      </button>
      <button
        className='tournament-button orange'
        onClick={() => /* navigate('/errorpage')  dovra' portare al primo incontro disponibile */ {
          const tournamentData = getTournamentsDataForTable();
          getNextMatches(tournamentData[0]._id).then(() => {
            const matchesData = getMatchesDataForTable();
            console.table(tournamentData);
            console.table(matchesData);
          });
        }}
      >
        Inizia Prossimo Incontro
      </button>
    </div>
  );
}
