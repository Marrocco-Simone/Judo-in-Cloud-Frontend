import React, { FC, useContext, useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';
import { CategoryI } from '../../models/category.model';
import { TournamentI } from '../../models/tournament.model';
import { apiGet } from '../../Services/Api/api';
import { AuthContext } from '../../Services/Auth/AuthContext';
import Brackets from '../Bracket/Brackets';

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

  return (
    <div className='bg-white dark:bg-neutral-800 md:px-4 px-2 pt-3'>
      <h1 className='pb-2'>
        <span className='text-3xl font-extrabold'>
          <span className='dark:text-neutral-50'>{tournament.competition.name}</span>
          &nbsp;-&nbsp;
          {getTournamentName(tournament.category)}
        </span>
        {getBackButton()}
      </h1>

      <Brackets tournament={tournament}/>
    </div>
  );
};

export default TournamentPage;
