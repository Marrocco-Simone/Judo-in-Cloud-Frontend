import React, { FC, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { CategoryI } from '../../models/category.model';
import { TournamentI } from '../../models/tournament.model';
import { apiGet } from '../../Services/Api/api';
import Brackets from '../Bracket/Brackets';

const PublicBrackets: FC = () => {
  const params = useParams();
  const tournamentId = params.tournamentId!;
  const [tournament, setTournament] = useState<TournamentI | null>(null);

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

  return (
    <>
      <h1 className='pb-2'>
        <span className='text-3xl font-extrabold'>
          <NavLink to={`/${tournament.competition.slug}`}>
            <span className='text-sky-400'>
              {tournament.competition.name}
            </span>
          </NavLink>
          &nbsp;-&nbsp;
          {getTournamentName(tournament.category)}
        </span>
      </h1>
      <Brackets tournament={tournament}></Brackets>
    </>
  );
};

export default PublicBrackets;
