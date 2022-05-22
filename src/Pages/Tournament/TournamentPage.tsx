import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TournamentI } from '../../models/tournament.model';
import { apiGet } from '../../Services/Api/api';
import Bracket from '../Bracket/Bracket';

export const TournamentPage: FC = () => {
  const params = useParams();
  const tournamentId = params.tournamentId!;
  const [tournament, setTournament] = useState<TournamentI | null>(null);

  useEffect(() => {
    apiGet(`v1/tournaments/${tournamentId}`).then(res => {
      setTournament(res);
    }).catch(err => {
      console.error({ err });
    });
  }, [tournamentId]);

  if (!tournament) {
    return <div>Caricamento...</div>;
  }

  return (
    <div>
      <Bracket bracket={tournament.winners_bracket}></Bracket>
    </div>
  );
};

export default TournamentPage;
