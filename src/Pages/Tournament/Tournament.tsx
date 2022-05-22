import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/tournament.css';
import TournamentTable from './components/TournamentTable';
import MatchTable from './components/MatchTable';
import { apiGet } from '../../Services/Api/api';
import {
  TournamentInterface,
  MatchInterface,
  TournamentTableData,
  MatchTableData,
} from '../../Types/types';
import Swal from 'sweetalert2';

export default function Tournament() {
  // for redirect
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState<TournamentInterface[]>([]);
  const [matches, setMatches] = useState<MatchInterface[]>([]);
  const [activeTournament, setActiveTournament] = useState<string>('');
  const [activeMatch, setActiveMatch] = useState<string>('');

  useEffect(() => {
    apiGet('v1/tournaments').then((tournamentData) => {
      setTournaments(tournamentData);
    });
  }, []);

  function getNextMatches(tournamentId: string) {
    /* apiGet(`v1/tournaments/${tournamentId}/next`).then((matchTableData) => { */
    apiGet(`v1/tournaments/${tournamentId}`).then((matchData) => {
      setMatches(matchData.winners_bracket[0]);
    });
  }

  useEffect(() => getNextMatches(activeTournament), [activeTournament]);

  function getTournamentsDataForTable() {
    const tournamentTableData: TournamentTableData[] = [];
    for (const tour of tournaments) {
      tournamentTableData.push({
        _id: tour._id,
        ageClassName: tour.category.age_class.name,
        weight: `U${tour.category.max_weight}`,
        gender: tour.category.gender,
        finished: tour.finished,
      });
    }
    return tournamentTableData;
  }

  function getMatchesDataForTable() {
    const matchTableData: MatchTableData[] = [];
    for (const match of matches) {
      if (
        !match?.white_athlete?.surname ||
        !match?.white_athlete?.name ||
        !match?.red_athlete?.surname ||
        !match?.red_athlete?.name
      ) {
        continue;
      }
      matchTableData.push({
        _id: match._id,
        whiteAthlete: `${match.white_athlete.surname} ${match.white_athlete.name}`,
        redAthlete: `${match.red_athlete.surname} ${match.red_athlete.name}`,
        isStarted: match.is_started,
        isOver: match.is_over,
      });
    }
    return matchTableData;
  }

  return (
    <div className='tournament-grid-container'>
      <div className='n-tatami-container'>Tornei</div>
      <div className='blank-space'></div>
      <div className='table-text'>Categorie Prenotate</div>
      <div className='table-text'>Lista Incontri</div>
      <div className='table-container'>
        <TournamentTable
          tournamentTableData={getTournamentsDataForTable()}
          activeTournament={activeTournament}
          setActiveTournament={setActiveTournament}
        />
      </div>
      <div className='table-container'>
        <MatchTable
          matchTableData={getMatchesDataForTable()}
          activeMatch={activeMatch}
          setActiveMatch={setActiveMatch}
        />
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
        onClick={() => navigate(`/match-timer/${activeMatch}`)}
      >
        Inizia Prossimo Incontro
      </button>
    </div>
  );
}
