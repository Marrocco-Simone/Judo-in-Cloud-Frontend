import React from 'react';
import { AthleteI } from '../../models/athlete.model';

type propsType = {
  player: AthleteI | null;
  state: 'won' | 'lost' | 'tbd';
}

function Player ({ player, state }: propsType) {
  return (
    <div className={`player border-2 flex justify-center items-center ${state}`}>
      {player?.name} {player?.surname}
    </div>
  );
}

export default Player;
