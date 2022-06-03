import React from 'react';
import Player from './Player';
import Round from './Round';
import './Bracket.css';
import { BracketI } from '../../models/bracket.model';

type PropsT = {
  bracket: BracketI;
  compact: boolean;
}

function Bracket ({ bracket, compact }: PropsT) {
  const finalMatch = bracket[bracket.length - 1][0];
  const winner = finalMatch !== null && finalMatch.winner_athlete !== null
    ? finalMatch.winner_athlete
    : null;

  const roundsEl = bracket.map((round, roundIdx) => {
    return (
      <Round key={roundIdx} round={round}
      ></Round>
    );
  });
  return (
    <div className='overflow-x-auto'>
      <div className={`flex bracket ${compact ? 'compact' : ''}`}>
        {roundsEl}
        <div className='flex items-center'>
          <Player player={winner} state={winner !== null ? 'won' : 'tbd'}></Player>
        </div>
      </div>
    </div>
  );
}

export default Bracket;
