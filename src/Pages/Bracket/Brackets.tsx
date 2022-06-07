import React, { FC } from 'react';
import { TournamentI } from '../../models/tournament.model';
import Bracket from '../Bracket/Bracket';

interface PropsT {
  tournament: TournamentI;
};

export const Brackets: FC<PropsT> = ({ tournament }) => {
  const compact = tournament.winners_bracket.length > 3;
  return (
    <div>
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

export default Brackets;
