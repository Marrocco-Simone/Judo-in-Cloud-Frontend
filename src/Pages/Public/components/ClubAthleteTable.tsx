import React, { useEffect, useState } from 'react';
import { apiGet } from '../../../Services/Api/api';
import { AthleteInterface, TournamentInterface } from '../../../Types/types';

type ClubAthlete = {
  name: string;
  surname: string;
  tournament_name: string;
  tournament_id?: string;
  tournament_tatami?: number;
};

type AthleteData = AthleteInterface & { tournament: string };

export default function ClubAthleteTable(props: {
  club: string;
  tournaments: TournamentInterface[];
  getTournamentName: (tour?: TournamentInterface) => string;
}) {
  const { club, tournaments, getTournamentName } = props;
  const [clubAthletes, setClubAthletes] = useState<ClubAthlete[]>([]);

  function getClubAthletes(athletesData: AthleteData[]) {
    return athletesData.map((athlete: AthleteData) => {
      const tour = tournaments.find(
        (tournament) => tournament._id === athlete.tournament
      );
      return {
        name: athlete.name,
        surname: athlete.surname,
        tournament_name: getTournamentName(tour),
        tournament_id: tour?._id,
        tournament_tatami: tour?.tatami_number,
      };
    });
  }

  useEffect(() => {
    apiGet(`v1/athletes/club/${club}`).then((athletesData: AthleteData[]) =>
      setClubAthletes(getClubAthletes(athletesData))
    );
  }, []);

  console.table(clubAthletes);

  return <div>{club}</div>;
}
