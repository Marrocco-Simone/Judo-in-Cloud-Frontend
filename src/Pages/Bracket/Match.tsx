import React from 'react';
import { MatchI } from '../../models/match.model';
import BracketLines from './BracketLines';
import Player from './Player';

type PropsT = {
  match: MatchI | null;
}

function Match ({ match }: PropsT) {
  match = match ?? {
    white_athlete: null,
    red_athlete: null,
    winner_athlete: null,
  } as MatchI;

  const players = [match.white_athlete, match.red_athlete];
  const winnerId = match.winner_athlete?._id ?? null;
  const disputed = winnerId !== null;

  const playersEl = players.map((player, playerIdx) => {
    const playerId = player?._id ?? null;
    let state: 'won' | 'lost' | 'tbd' = 'tbd';
    if (disputed) {
      state = winnerId === playerId ? 'won' : 'lost';
    }
    return (
      <div className='h-1/2 flex items-center' key={playerIdx}>
        <Player player={player} state={state}
        ></Player>
      </div>
    );
  });

  return (
    <div className='flex flex-grow'>
      <div>
        {playersEl}
      </div>
      <BracketLines match={match}></BracketLines>
    </div>
  );
}

export default Match;
