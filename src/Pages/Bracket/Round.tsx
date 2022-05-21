import React from 'react';
import { RoundI } from '../../models/bracket.model';
import Match from './Match';

type PropsT = {
  round: RoundI;
}

function Round ({ round }: PropsT) {
  const matchEl = round.map((match, matchIdx) => {
    return (
      <Match match={match} key={matchIdx}
      ></Match>
    );
  });
  return (
    <div className='flex flex-col'>
      {matchEl}
    </div>
  );
}

export default Round;
