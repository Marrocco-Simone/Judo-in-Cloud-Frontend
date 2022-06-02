import React, { FC, useContext, useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';
import { CategoryI } from '../../models/category.model';
import { TournamentI } from '../../models/tournament.model';
import { apiGet } from '../../Services/Api/api';
import { AuthContext } from '../../Services/Auth/AuthContext';
import Bracket from '../Bracket/Bracket';

export const TournamentPage: FC = () => {
  const params = useParams();
  const tournamentId = params.tournamentId!;
  const [tournament, setTournament] = useState<TournamentI | null>(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    apiGet(`v2/tournaments/${tournamentId}`)
      .then((res) => {
        setTournament(res);
      })
      .catch((err) => {
        console.error({ err });
      });
  }, [tournamentId]);

  if (!tournament) {
    return <div>Caricamento...</div>;
  }

  function getTournamentName(category: CategoryI) {
    return `${category.age_class.name} ${category.max_weight} ${category.gender}`;
  }

  function getBackButton() {
    if (user) {
      return (
        <NavLink
          className='flex items-center'
          to={`..?from_tournament=${tournament!._id}`}
        >
          <FaArrowLeft className='mr-1' />
          Torna alla gestione torneo
        </NavLink>
      );
    }
    return (
      <></>
    );
  }

  const compact = tournament.winners_bracket.length > 3;
  return (
    <div>
      <h1 className='pb-2'>
        <>
          <span className='text-3xl font-extrabold'>
            <NavLink to={`/${tournament.competition.slug}`}>
              <span className='text-sky-400'>{tournament.competition.name}</span>
            </NavLink>
            &nbsp;-&nbsp;
            {getTournamentName(tournament.category)}
          </span>
          {getBackButton()}
        </>
      </h1>

      <h2 className='text-xl font-bold pb-1'>Tabellone vincitori</h2>
      <Bracket compact={compact} bracket={tournament.winners_bracket} />

      <h2 className='text-xl font-bold pb-1 mt-4'>
        Primo tabellone recuperati
      </h2>
      <Bracket compact={compact} bracket={tournament.recovered_bracket_1} />
      <h2 className='text-xl font-bold pb-1 mt-4'>
        Secondo tabellone recuperati
      </h2>
      <Bracket compact={compact} bracket={tournament.recovered_bracket_2} />
    </div>
  );
};

export default TournamentPage;
