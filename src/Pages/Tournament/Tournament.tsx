import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TournamentTable from './components/TournamentTable';
import MatchTable from './components/MatchTable';
import { apiGet, apiPost } from '../../Services/Api/api';
import {
  TournamentInterface,
  MatchInterface,
  TournamentTableData,
  MatchTableData,
} from '../../Types/types';
import Swal from 'sweetalert2';
import OrangeButton from '../../Components/Buttons/OrangeButton';
import { Modal } from '../../Components/Modal/Modal';
import TournamentReserveTable from './components/TournamentReserveTable';

export default function Tournament() {
  /** for redirect */
  const navigate = useNavigate();
  /** get params from url */
  const [searchParams] = useSearchParams();
  /**
   * if there is a field 'from_tournament' in the query parameters,
   * it automatically assigns it the active tournament.
   * The usage is that when we redirect from this page to another one,
   * when the page redirect back to this page, the user doesn't need
   * to select again the tournament
   */
  const getTournaments = () => {
    const fromTournament = searchParams.get('from_tournament');
    if (!fromTournament) return '';
    return fromTournament;
  };

  const [tournaments, setTournaments] = useState<TournamentInterface[]>([]);
  const [matches, setMatches] = useState<MatchInterface[]>([]);
  const [activeTournament, setActiveTournament] = useState(getTournaments());
  const [activeMatch, setActiveMatch] = useState<string>('');
  const [nTatami, setNTatami] = useState(-1);
  const [isReserveOpen, setIsReserveOpen] = useState(false);

  /**
   * get data of tournaments when opening the page
   * user enters the tatami number
   */
  useEffect(() => {
    apiGet('v1/tournaments').then((tournamentData) => {
      setTournaments(tournamentData);
    });
    Swal.fire({
      title: 'Inserire numero Tatami',
      input: 'number',
      preConfirm: (value) => {
        const num = Number(value);
        if (isNaN(num) || !num || num < 1) {
          Swal.showValidationMessage('Inserire numero Tatami');
        } else setNTatami(num);
      },
      allowOutsideClick: false,
    });
  }, []);

  /** when selecting a tournament, load its matches */
  useEffect(() => {
    /* TODO bisogna sistemare l'api e poi questo */
    /* apiGet(`v1/tournaments/${tournamentId}/next`).then((matchTableData) => { */
    apiGet(`v1/tournaments/${activeTournament}`).then((matchData) => {
      if (!matchData?.winners_bracket) return;
      if (matchData.winners_bracket.length === 0) return;

      let totalMatches: MatchInterface[] = [];
      for (const bracket of matchData.winners_bracket) {
        totalMatches = [...totalMatches, ...bracket];
      }
      setMatches(totalMatches);
    });
  }, [activeTournament]);

  function getTournamentsDataForTable() {
    const tournamentTableData: TournamentTableData[] = [];

    for (const tour of tournaments) {
      tournamentTableData.push({
        _id: tour._id,
        ageClassName: tour.category.age_class.name,
        weight: `U${tour.category.max_weight}`,
        gender: tour.category.gender,
        finished: tour.finished,
        tatami_number: tour.tatami_number,
      });
    }

    return tournamentTableData;
  }

  /** returns if one of the athletes of a match is undefined */
  function isMatchWithNullAthlete(match: MatchInterface) {
    if (!match?.white_athlete) return true;
    if (!match?.red_athlete) return true;
    return false;
  }

  function getMatchesDataForTable() {
    const matchTableData: MatchTableData[] = [];
    for (const match of matches) {
      if (isMatchWithNullAthlete(match)) continue;

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

  function confirmGoFinishedMatch(title: string, info: string) {
    Swal.fire({
      title,
      html: info,
      showCancelButton: true,
      confirmButtonText: "Continua con l'incontro",
      cancelButtonText: 'Torna Indietro',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(
          `/match-timer/${activeMatch}?from_tournament=${activeTournament}`
        );
      }
    });
  }

  function startNextMatch() {
    const fullActiveMatch = matches.find((m) => m._id === activeMatch);
    if (!fullActiveMatch) {
      return Swal.fire('Nessun incontro selezionato', '', 'error');
    }
    if (fullActiveMatch?.is_over) {
      return confirmGoFinishedMatch(
        "Incontro gia' concluso",
        "Attenzione, l'incontro e' finito. Vuoi recuperarlo per cambiare l'esito?"
      );
    }
    if (fullActiveMatch?.is_started) {
      return confirmGoFinishedMatch(
        "Incontro gia' iniziato",
        "Attenzione, l'incontro e' gia' stato iniziato da qualche altro tavolo. Iniziarlo e finirlo qui sovrascriverebbe i dati dell'altro tavolo. Continuare?"
      );
    }
    navigate(`/match-timer/${activeMatch}?from_tournament=${activeTournament}`);
  }

  async function reserveTournament(tournamentId: string) {
    const tourIndex = tournaments.findIndex(
      (tour) => tour._id === tournamentId
    );
    if (tourIndex < 0) return;
    if (tournaments[tourIndex].tatami_number === nTatami) return;

    if (tournaments[tourIndex].tatami_number > 0) {
      const result = await Swal.fire({
        title: "Torneo gia' prenotato",
        text: "Questo torneo e' gia' stato prenotato da un altro tavolo. Prenotandolo esso non sara' piu' in grado di iniziare altri incontri finche' non lo riprenotera'",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: "Si', lo voglio io",
        cancelButtonText: "No, lascialo com'e",
      });
      if (!result.isConfirmed) return;
    }

    apiPost(`v2/tournaments/reserve/${tournamentId}`, {
      tatami_number: nTatami,
    });

    setTournaments((prevTournaments) =>
      prevTournaments.map((tour) => {
        const newTour: TournamentInterface = tour;
        if (tour._id === tournamentId) newTour.tatami_number = nTatami;
        return newTour;
      })
    );
  }

  return (
    <div className='tournament-container'>
      <div className='n-tatami-container'>
        {nTatami > 0 && `Tatami numero ${nTatami}`}
      </div>
      <div className='multi-table-container'>
        <div className='table-container'>
          <div className='table-text'>Categorie Prenotate</div>
          <TournamentTable
            tournamentTableData={getTournamentsDataForTable().filter(
              (tour) => tour.tatami_number === nTatami
            )}
            activeTournament={activeTournament}
            setActiveTournament={setActiveTournament}
          />
        </div>
        <div className='table-container'>
          <div className='table-text'>Lista Incontri</div>
          <MatchTable
            matchTableData={getMatchesDataForTable()}
            activeMatch={activeMatch}
            setActiveMatch={setActiveMatch}
          />
        </div>
      </div>
      <div className='button-row'>
        <OrangeButton onClickFunction={() => setIsReserveOpen(true)}>
          Prenota Categorie
        </OrangeButton>
        <OrangeButton
          onClickFunction={() => navigate(`/tournament/${activeTournament}`)}
        >
          Apri Tabellone
        </OrangeButton>
        <OrangeButton
          onClickFunction={() =>
            navigate(`/match-timer?from_tournament=${activeTournament}`)
          }
        >
          Incontro Amichevole
        </OrangeButton>
        <OrangeButton onClickFunction={() => startNextMatch()}>
          Inizia Incontro Selezionato
        </OrangeButton>
      </div>
      {isReserveOpen && (
        <Modal handleClose={() => setIsReserveOpen(false)}>
          <div className='table-container'>
            <div className='table-text'>Prenota una Categoria</div>
            <TournamentReserveTable
              tournamentTableData={getTournamentsDataForTable()}
              activeTournament={`${nTatami}`}
              setActiveTournament={reserveTournament}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
