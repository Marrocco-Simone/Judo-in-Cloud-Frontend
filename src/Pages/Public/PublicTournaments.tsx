import React, { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PublicOutletContext } from './PublicShell';

const PublicTournaments: FC = () => {
  const { competition } = useOutletContext<PublicOutletContext>();

  return <>{competition.name}</>;
};

export default PublicTournaments;
