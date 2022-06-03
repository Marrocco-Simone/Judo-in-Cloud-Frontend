import React from 'react';
import { MatchI } from '../../models/match.model';

type PropsT = {
  match: MatchI;
}

function BracketLines ({ match }: PropsT) {
  const players = [match.white_athlete, match.red_athlete];
  const winnerId = match.winner_athlete?._id ?? null;
  const disputed = winnerId !== null;
  const loserRecovered = match.loser_recovered;

  const forwardLinesEl = players.map((player, playerIdx) => {
    const playerId = player?._id ?? null;
    const won = disputed && playerId === winnerId;
    const lost = disputed && playerId !== winnerId;
    return (
      <div key={playerIdx}
        className={`h-1/4 border-r-2 bracket-line
        ${won ? 'won' : ''}
        ${lost ? 'lost' : ''}
        ${loserRecovered ? 'recovered' : ''}
        ${playerIdx === 0 ? 'border-t-2' : 'border-b-2'}`}
      ></div>
    );
  });

  return (
    <div className='flex'>
      {/* 2 forward lines from players */}
      <div>
        <div className='h-1/4'></div>
        {forwardLinesEl}
      </div>
      {/* connecting line */}
      <div>
        <div className={`h-1/2 border-b-2 bracket-line
          ${disputed ? 'won' : ''}`}
        ></div>
      </div>
    </div>
  );
}

export default BracketLines;
