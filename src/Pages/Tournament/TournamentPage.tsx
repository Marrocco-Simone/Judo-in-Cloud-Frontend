import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

export const TournamentPage: FC = () => {
  const params = useParams();
  const tournamentId = parseInt(params.tournamentId!, 10);

  return (
    <div>
      Tournament with id {tournamentId}
    </div>
  );
};

export default TournamentPage;
