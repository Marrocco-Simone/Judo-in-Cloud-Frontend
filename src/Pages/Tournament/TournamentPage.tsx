import React, { FC, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { CategoryI } from '../../models/category.model';
import { TournamentI } from '../../models/tournament.model';
import { apiGet } from '../../Services/Api/api';
import Bracket from '../Bracket/Bracket';

export const TournamentPage: FC = () => {
  const params = useParams();
  const tournamentId = params.tournamentId!;
  const [tournament, setTournament] = useState<TournamentI | null>(null);

  useEffect(() => {
    apiGet(`v2/tournaments/${tournamentId}`).then(res => {
      setTournament(res);
    }).catch(err => {
      console.error({ err });
    });
  }, [tournamentId]);

  if (!tournament) {
    return <div>Caricamento...</div>;
  }

  function getTournamentName (category: CategoryI) {
    return `${category.age_class.name} ${category.max_weight} ${category.gender}`;
  }

  const compact = tournament.winners_bracket.length > 3;
  return (
    <div>
      <h1 className='text-3xl font-extrabold pb-2'>
        <>
          <NavLink to={`/${tournament.competition.slug}`}>
            <span className='text-sky-400'>{tournament.competition.name}</span>
          </NavLink>
          &nbsp;-&nbsp;
          {getTournamentName(tournament.category)}
        </>
      </h1>

      <h2 className='text-xl font-bold pb-1'>
        Tabellone vincitori
      </h2>
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
