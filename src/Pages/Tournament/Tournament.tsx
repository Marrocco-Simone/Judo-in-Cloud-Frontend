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
        winnerAthlete: match.is_over
          ? `${match.winner_athlete.surname} ${match.winner_athlete.name}`
          : '',
        isStarted: match.is_started,
        isOver: match.is_over,
      });
    }
    return matchTableData;
  }

  function confirmGoNextMatch(title: string, info: string) {
    Swal.fire({
      title,
      html: info,
      showCancelButton: true,
      confirmButtonText: 'Continua con l\'incontro',
      cancelButtonText: 'Torna Indietro',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/match-timer/${activeMatch}`);
      }
    });
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
        onClick={() => navigate(`/tournament/${activeTournament}`)}
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
        onClick={() => {
          const fullActiveMatch = matches.find((m) => m._id === activeMatch);
          if (!fullActiveMatch) return Swal.fire('Nessun incontro selezionato');
          if (fullActiveMatch?.is_over) {
            return confirmGoNextMatch(
              "Incontro gia' concluso",
              "Attenzione, l'incontro e' finito. Vuoi recuperarlo per cambiare l'esito?"
            );
          }
          if (fullActiveMatch?.is_started) {
            return confirmGoNextMatch(
              "Incontro gia' iniziato",
              "Attenzione, l'incontro e' gia' stato iniziato da qualche altro tavolo. Iniziarlo e finirlo qui sovrascriverebbe i dati dell'altro tavolo. Continuare?"
            );
          }
          navigate(`/match-timer/${activeMatch}`);
        }}
      >
        Inizia Incontro Selezionato
      </button>
    </div>
  );
}
