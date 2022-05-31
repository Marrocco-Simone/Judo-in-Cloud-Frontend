import React from 'react';

export default function ClubAthleteTable(props: {
  club: string
}) {
  const { club } = props;
  return <div>{club}</div>;
}
